"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/app/actions";
import { requireAdmin } from "@/lib/admin";
import { createAdminSessionClient } from "@/lib/supabase/server";

const field = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Same rules as the CHECK constraints in the migration.
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const HTTP = /^https?:\/\/[^\s]+\.[^\s]+$/;
const REEL = /^https:\/\/(www\.)?instagram\.com\//;
const LOGO_TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const MAX_LOGO_BYTES = 800 * 1024; // Server Actions cap request bodies at 1MB
const SUBMISSION_STATUSES = ["new", "reviewed", "added"];

// Public pages are static; this makes every one of them pick up the change on the next visit.
const refreshSite = () => revalidatePath("/", "layout");

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password.", values: { email } };

  const supabase = await createAdminSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const message = error.code === "invalid_credentials" ? "Wrong email or password." : error.message;
    return { ok: false, message, values: { email } };
  }
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: "That account isn't the admin. Add it to the admins table (see README).", values: { email } };
  }
  redirect("/admin");
}

export async function signOut() {
  await (await createAdminSessionClient()).auth.signOut();
  redirect("/admin/login");
}

export async function toggleTool(id: number, column: "published" | "is_featured", value: boolean) {
  if (column !== "published" && column !== "is_featured") throw new Error("Invalid column"); // bound args can be tampered with
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tools").update({ [column]: value }).eq("id", id);
  if (error) throw new Error(error.message);
  refreshSite();
}

export async function deleteTool(id: number) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect("/admin");
}

export async function setSubmissionStatus(id: number, fd: FormData) {
  const status = field(fd, "status");
  if (!SUBMISSION_STATUSES.includes(status)) throw new Error("Invalid status");
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("tool_submissions").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

const TEXT_FIELDS = [
  "name", "slug", "tagline", "description", "website_url", "affiliate_url", "pricing_type", "price_note",
  "rating", "verdict", "reel_url", "category_id", "featured_until", "tags", "logo_url",
] as const;

export async function saveTool(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const id = Number(fd.get("id")) || null;
  const values: Record<string, string> = Object.fromEntries(TEXT_FIELDS.map((k) => [k, field(fd, k)]));
  values.is_featured = fd.get("is_featured") ? "on" : "";
  values.published = fd.get("published") ? "on" : "";
  values.slug ||= slugify(values.name);
  const logo = fd.get("logo");

  const errors: Record<string, string> = {};
  if (!values.name) errors.name = "Name is required.";
  if (!SLUG.test(values.slug)) errors.slug = "Lowercase letters, numbers, and dashes only, e.g. notion-ai";
  if (!HTTP.test(values.website_url)) errors.website_url = "Full URL starting with https://";
  if (values.affiliate_url && !HTTP.test(values.affiliate_url)) errors.affiliate_url = "Full URL starting with https://";
  if (values.reel_url && !REEL.test(values.reel_url)) errors.reel_url = "Must be an https://www.instagram.com/... link";
  if (!["free", "freemium", "paid"].includes(values.pricing_type)) errors.pricing_type = "Pick a pricing type.";
  const rating = values.rating ? Number(values.rating) : null;
  if (rating !== null && !(rating >= 1 && rating <= 5 && Number.isInteger(rating * 2))) {
    errors.rating = "1 to 5, half stars allowed (e.g. 4.5)";
  }
  if (logo instanceof File && logo.size > 0) {
    if (!LOGO_TYPES[logo.type]) errors.logo = "PNG, JPG, or WebP only.";
    else if (logo.size > MAX_LOGO_BYTES) errors.logo = "Logo must be under 800 KB.";
  }
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", errors, values };

  let logo_url = fd.get("remove_logo") ? null : values.logo_url || null;
  if (logo instanceof File && logo.size > 0) {
    // ponytail: replaced logos stay in the bucket. Delete the old file here if storage space ever matters.
    const path = `${values.slug}-${Date.now()}.${LOGO_TYPES[logo.type]}`;
    const upload = await supabase.storage.from("logos").upload(path, logo, { contentType: logo.type });
    if (upload.error) return { ok: false, message: `Logo upload failed: ${upload.error.message}`, values };
    logo_url = supabase.storage.from("logos").getPublicUrl(path).data.publicUrl;
  }

  const row = {
    name: values.name,
    slug: values.slug,
    tagline: values.tagline || null,
    description: values.description || null,
    website_url: values.website_url,
    affiliate_url: values.affiliate_url || null,
    logo_url,
    pricing_type: values.pricing_type,
    price_note: values.price_note || null,
    rating,
    verdict: values.verdict || null,
    reel_url: values.reel_url || null,
    category_id: values.category_id ? Number(values.category_id) : null,
    is_featured: values.is_featured === "on",
    featured_until: values.featured_until || null,
    published: values.published === "on",
  };
  const saved = id
    ? await supabase.from("tools").update(row).eq("id", id).select("id").single()
    : await supabase.from("tools").insert(row).select("id").single();
  if (saved.error) {
    if (saved.error.code === "23505") {
      return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "Another tool already uses this slug." }, values };
    }
    return { ok: false, message: `Save failed: ${saved.error.message}`, values };
  }

  // Tags: comma-separated names. Unknown ones are created; the tool's tag list is replaced.
  const toolId: number = saved.data.id;
  const tags = new Map<string, string>();
  for (const name of values.tags.split(",").map((s) => s.trim())) if (slugify(name)) tags.set(slugify(name), name);
  const tagError = await (async () => {
    const del = await supabase.from("tool_tags").delete().eq("tool_id", toolId);
    if (del.error || tags.size === 0) return del.error;
    const up = await supabase
      .from("tags")
      .upsert([...tags].map(([slug, name]) => ({ slug, name })), { onConflict: "slug" })
      .select("id");
    if (up.error) return up.error;
    return (await supabase.from("tool_tags").insert(up.data.map((t) => ({ tool_id: toolId, tag_id: t.id })))).error;
  })();

  refreshSite();
  if (tagError) return { ok: false, message: `Tool saved, but tags failed: ${tagError.message}`, values: { ...values, id: String(toolId) } };
  redirect("/admin");
}

"use server";

import { createPublicClient } from "@/lib/supabase/public";

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>; // echoed back so a failed submit doesn't wipe what was typed
} | null;

// Mirrors the CHECK constraints in the migration, so users see friendly messages instead of DB errors.
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const field = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();
const isBot = (fd: FormData) => field(fd, "company") !== ""; // hidden honeypot input

// "notion.so" -> "https://notion.so/". Returns null if it isn't a plausible web address.
// Not exported: every export of a "use server" file becomes a public endpoint.
function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return url.hostname.includes(".") ? url.href : null;
  } catch {
    return null;
  }
}

// ponytail: no rate limiting beyond the honeypot. Add Supabase Edge rate limits or a captcha if spam shows up.
export async function joinWaitlist(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true, message: "You're on the list!" };
  const email = field(fd, "email").toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) {
    return { ok: false, message: "Please enter a valid email address.", values: { email } };
  }

  const { error } = await createPublicClient().from("waitlist_emails").insert({ email });
  if (error?.code === "23505") return { ok: true, message: "You're already on the list. Thanks!" };
  if (error) {
    console.error("joinWaitlist", error);
    return { ok: false, message: "Something went wrong on our side. Please try again.", values: { email } };
  }
  return { ok: true, message: "You're on the list! New reviews will land in your inbox." };
}

export async function submitTool(_: FormState, fd: FormData): Promise<FormState> {
  const values = {
    tool_name: field(fd, "tool_name"),
    website_url: field(fd, "website_url"),
    contact_email: field(fd, "contact_email").toLowerCase(),
    message: field(fd, "message"),
  };
  if (isBot(fd)) return { ok: true, message: "Thanks! I'll take a look." };

  const errors: Record<string, string> = {};
  if (!values.tool_name) errors.tool_name = "What's the tool called?";
  else if (values.tool_name.length > 100) errors.tool_name = "Keep the name under 100 characters.";
  const url = normalizeUrl(values.website_url);
  if (!url || url.length > 500) errors.website_url = "Enter the tool's website, e.g. example.com";
  if (values.contact_email.length > 254 || !EMAIL.test(values.contact_email)) {
    errors.contact_email = "Enter a valid email so I can reach you.";
  }
  if (values.message.length > 2000) errors.message = `Keep it under 2000 characters (now ${values.message.length}).`;
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", errors, values };

  const { error } = await createPublicClient()
    .from("tool_submissions")
    .insert({ ...values, website_url: url, message: values.message || null });
  if (error) {
    console.error("submitTool", error);
    return { ok: false, message: "Something went wrong on our side. Please try again.", values };
  }
  return { ok: true, message: `Thanks! I'll check out ${values.tool_name} and reach out if it's a fit.` };
}

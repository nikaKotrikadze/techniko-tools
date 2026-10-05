"use client";

import { useActionState } from "react";
import { deleteTool, saveTool } from "@/app/admin/actions";
import type { Category } from "@/lib/data";

export type ToolFormInitial = Partial<Record<string, string>> & { id?: string };

export function ToolForm({ initial, categories }: { initial: ToolFormInitial; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveTool, null);
  // After a failed save, show what was submitted; otherwise the saved tool.
  const v = (k: string) => (state?.values ? state.values[k] : initial[k]) ?? "";
  const err = (k: string) => state?.errors?.[k];
  const id = state?.values?.id ?? initial.id; // set if a new tool saved but its tags failed

  const text = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input name={name} defaultValue={v(name)} aria-invalid={err(name) ? true : undefined} className="admin-input" {...props} />
      {err(name) && <span className="font-normal text-red-600 dark:text-red-400">{err(name)}</span>}
    </label>
  );
  const area = (name: string, label: string, rows = 3) => (
    <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
      {label}
      <textarea name={name} rows={rows} defaultValue={v(name)} className="admin-input" />
    </label>
  );

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="grid gap-5 sm:grid-cols-2">
        {id && <input type="hidden" name="id" value={id} />}
        <input type="hidden" name="logo_url" value={v("logo_url")} />
        {text("name", "Name", { required: true })}
        {text("slug", "Slug (URL)", { placeholder: "auto from name", pattern: "[a-z0-9]+(-[a-z0-9]+)*" })}
        {text("tagline", "Tagline", { placeholder: "One line, shown on cards" })}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Category
          <select name="category_id" defaultValue={v("category_id")} className="admin-input">
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </label>
        {text("website_url", "Website URL", { type: "url", required: true, placeholder: "https://" })}
        {text("affiliate_url", "Affiliate URL (optional, used for Try it)", { type: "url", placeholder: "https://" })}
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Pricing
          <select name="pricing_type" defaultValue={v("pricing_type") || "freemium"} className="admin-input">
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        {text("price_note", "Price note", { placeholder: "e.g. Free plan, Pro $20/mo" })}
        {text("rating", "Rating (1-5)", { type: "number", min: 1, max: 5, step: 0.5, inputMode: "decimal" })}
        {text("reel_url", "Instagram reel URL", { type: "url", placeholder: "https://www.instagram.com/reel/..." })}
        {area("verdict", "My verdict", 2)}
        {area("description", "Description", 5)}
        {text("tags", "Tags (comma separated)", { placeholder: "Free plan, For creators" })}

        <div className="flex flex-col gap-1.5 text-sm font-medium">
          Logo (PNG, JPG, WebP, under 800 KB)
          <div className="flex items-center gap-3">
            {v("logo_url") && (
              // eslint-disable-next-line @next/next/no-img-element -- tiny admin preview
              <img src={v("logo_url")} alt="" width={40} height={40} className="rounded-lg" />
            )}
            <input
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="text-sm font-normal"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.setCustomValidity(file && file.size > 800 * 1024 ? "Logo must be under 800 KB." : "");
                e.currentTarget.reportValidity();
              }}
            />
          </div>
          {v("logo_url") && (
            <label className="flex items-center gap-2 font-normal text-muted">
              <input type="checkbox" name="remove_logo" /> Remove current logo
            </label>
          )}
          {err("logo") && <span className="font-normal text-red-600 dark:text-red-400">{err("logo")}</span>}
        </div>

        <fieldset className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:col-span-2">
          <legend className="px-1 text-sm font-medium">Visibility</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={v("published") === "on"} /> Published (visible on the site)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" defaultChecked={v("is_featured") === "on"} /> Featured (paid placement, shown
            as Sponsored)
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:max-w-xs">
            Featured until (leave empty for no end date)
            <input type="date" name="featured_until" defaultValue={v("featured_until")} className="admin-input" />
          </label>
        </fieldset>

        {state && !state.ok && (
          <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2 dark:text-red-400">{state.message}</p>
        )}
        <div className="flex gap-3 sm:col-span-2">
          <button disabled={pending} className="admin-btn-primary">{pending ? "Saving…" : "Save tool"}</button>
          <a href="/admin" className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:border-accent">Cancel</a>
        </div>
      </form>

      {id && (
        <form
          action={deleteTool.bind(null, Number(id))}
          onSubmit={(e) => {
            if (!confirm("Delete this tool permanently?")) e.preventDefault();
          }}
          className="border-t border-border pt-6"
        >
          <button className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">Delete tool</button>
        </form>
      )}
    </div>
  );
}

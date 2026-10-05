import Link from "next/link";
import { toggleTool } from "../actions";
import { requireAdmin } from "@/lib/admin";

type Row = {
  id: number;
  name: string;
  slug: string;
  published: boolean;
  is_featured: boolean;
  featured_until: string | null;
  rating: number | null;
  category: { name: string } | null;
};

export default async function AdminToolsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("tools")
    .select("id, name, slug, published, is_featured, featured_until, rating, category:categories(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const tools = data as unknown as Row[];
  const today = new Date().toISOString().slice(0, 10);

  const pill = (on: boolean) =>
    `rounded-full border px-2.5 py-1 text-xs font-medium ${on ? "border-accent bg-accent/10 text-accent" : "border-border text-muted hover:border-accent"}`;

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tools ({tools.length})</h1>
        <Link href="/admin/tools/new" className="admin-btn-primary">+ New tool</Link>
      </div>
      <ul className="divide-y divide-border rounded-2xl border border-border">
        {tools.map((t) => {
          const expired = t.is_featured && t.featured_until !== null && t.featured_until < today;
          return (
            <li key={t.id} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/tools/${t.id}`} className="font-semibold hover:text-accent">{t.name}</Link>
                <p className="text-xs text-muted">
                  {t.category?.name ?? "No category"} · {t.rating !== null ? `★ ${t.rating}` : "Not rated"}
                  {t.published && (
                    <> · <Link href={`/tools/${t.slug}`} className="hover:underline">View ↗</Link></>
                  )}
                </p>
              </div>
              <form action={toggleTool.bind(null, t.id, "published", !t.published)}>
                <button className={pill(t.published)} title="Toggle published">{t.published ? "Published" : "Draft"}</button>
              </form>
              <form action={toggleTool.bind(null, t.id, "is_featured", !t.is_featured)}>
                <button className={pill(t.is_featured && !expired)} title="Toggle featured">
                  {expired ? "Featured (expired)" : t.is_featured ? "Featured" : "Not featured"}
                </button>
              </form>
              <Link href={`/admin/tools/${t.id}`} className="text-sm text-muted hover:text-foreground">Edit</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

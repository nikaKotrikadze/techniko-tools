import { notFound } from "next/navigation";
import { ToolForm } from "@/components/admin/ToolForm";
import { requireAdmin } from "@/lib/admin";

export default async function EditToolPage({ params }: PageProps<"/admin/tools/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const [{ data: tool }, { data: categories }] = await Promise.all([
    supabase.from("tools").select("*, tool_tags(tags(name))").eq("id", Number(id)).maybeSingle(),
    supabase.from("categories").select("*").order("name"),
  ]);
  if (!tool) notFound();

  const str = (x: unknown) => (x === null || x === undefined ? "" : String(x));
  const initial = {
    id: str(tool.id),
    ...Object.fromEntries(
      ["name", "slug", "tagline", "description", "website_url", "affiliate_url", "pricing_type", "price_note", "rating",
        "verdict", "reel_url", "category_id", "featured_until", "logo_url"].map((k) => [k, str(tool[k])]),
    ),
    tags: (tool.tool_tags as { tags: { name: string } | null }[]).flatMap((t) => (t.tags ? [t.tags.name] : [])).join(", "),
    published: tool.published ? "on" : "",
    is_featured: tool.is_featured ? "on" : "",
  };

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Edit {tool.name}</h1>
      <ToolForm categories={categories ?? []} initial={initial} />
    </main>
  );
}

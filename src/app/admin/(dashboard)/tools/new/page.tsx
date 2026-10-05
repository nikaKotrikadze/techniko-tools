import { ToolForm } from "@/components/admin/ToolForm";
import { requireAdmin } from "@/lib/admin";

export default async function NewToolPage({ searchParams }: PageProps<"/admin/tools/new">) {
  const { supabase } = await requireAdmin();
  const { name, url } = await searchParams; // prefilled from a submission
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">New tool</h1>
      <ToolForm
        categories={categories ?? []}
        initial={{ name: typeof name === "string" ? name : "", website_url: typeof url === "string" ? url : "" }}
      />
    </main>
  );
}

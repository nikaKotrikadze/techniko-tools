import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/ToolCard";
import { getCategories, getPublishedTools } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `Best AI ${category.name} tools`,
    description: `AI ${category.name.toLowerCase()} tools tested and rated by @thetechniko.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/category/[slug]">) {
  const { slug } = await params;
  const [categories, tools] = await Promise.all([getCategories(), getPublishedTools()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const list = tools.filter((t) => t.category?.slug === slug);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <nav aria-label="Categories" className="flex flex-wrap gap-2">
        <Link href="/" className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-sm hover:border-accent">
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            aria-current={c.slug === slug ? "page" : undefined}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm ${
              c.slug === slug ? "border-accent bg-accent text-white dark:text-black" : "border-border hover:border-accent"
            }`}
          >
            {c.icon} {c.name}
          </Link>
        ))}
      </nav>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {category.icon} AI {category.name} tools
      </h1>
      {list.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">No tools here yet.</p>
      )}
    </main>
  );
}

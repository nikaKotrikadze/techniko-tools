import { ToolBrowser } from "@/components/ToolBrowser";
import { getCategories, getPublishedTools } from "@/lib/data";

export const revalidate = 3600; // admin edits revalidate instantly (Phase 6); this is the fallback

export default async function Home() {
  const [tools, categories] = await Promise.all([getPublishedTools(), getCategories()]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
      <section className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          AI tools I&apos;ve <span className="text-accent">actually tested</span>
        </h1>
        <p className="max-w-xl text-muted sm:text-lg">
          Honest ratings, real pricing, and a video review for every tool. Picked by{" "}
          <a href="https://instagram.com/thetechniko" className="font-medium text-foreground underline-offset-4 hover:underline">
            @thetechniko
          </a>{" "}
          and 14K+ followers.
        </p>
      </section>
      <ToolBrowser tools={tools} categories={categories} />
    </main>
  );
}

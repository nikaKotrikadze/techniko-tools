"use client";

import { useState } from "react";
import type { Category, Tool } from "@/lib/data";
import { ToolCard } from "./ToolCard";

// Filters in the browser: the whole published list is small and already on the page.
// ponytail: client-side filtering, move search to Postgres full-text if the list grows past ~1000 tools.
export function ToolBrowser({ tools, categories }: { tools: Tool[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = tools.filter(
    (t) =>
      (!category || t.category?.slug === category) &&
      (!q || [t.name, t.tagline, t.category?.name, ...t.tags].some((s) => s?.toLowerCase().includes(q))),
  );
  const featured = tools.filter((t) => t.sponsored);
  const filtering = q !== "" || category !== null;

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition ${
      active ? "border-accent bg-accent text-white dark:text-black" : "border-border hover:border-accent"
    }`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label htmlFor="tool-search" className="sr-only">
          Search tools
        </label>
        <input
          id="tool-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, e.g. video, free plan, coding"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base outline-none focus:border-accent"
        />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filter by category">
          <button type="button" className={chip(category === null)} aria-pressed={category === null} onClick={() => setCategory(null)}>
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={chip(category === c.slug)}
              aria-pressed={category === c.slug}
              onClick={() => setCategory(category === c.slug ? null : c.slug)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      {!filtering && featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <h2 id="featured-heading" className="text-lg font-semibold">
              Featured
            </h2>
            <span className="text-xs text-muted">Sponsored placements</span>
          </div>
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {featured.map((t) => (
              <div key={t.id} className="w-72 shrink-0 snap-start">
                <ToolCard tool={t} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="all-heading" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 id="all-heading" className="text-lg font-semibold">
            {filtering ? "Results" : "All tools"}
          </h2>
          <span className="text-xs text-muted" aria-live="polite">
            {results.length} {results.length === 1 ? "tool" : "tools"}
          </span>
        </div>
        {results.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted">
            No tools match that yet. Try a different search or category.
          </p>
        )}
      </section>
    </div>
  );
}

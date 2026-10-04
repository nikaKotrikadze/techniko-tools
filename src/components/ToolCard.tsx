import Image from "next/image";
import Link from "next/link";
import { PRICING_LABEL, type Tool } from "@/lib/data";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="flex items-start gap-3">
        <ToolLogo tool={tool} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{tool.name}</h3>
          {tool.category && (
            <p className="text-xs text-muted">
              {tool.category.icon} {tool.category.name}
            </p>
          )}
        </div>
        {tool.rating !== null && (
          <span className="shrink-0 text-sm font-semibold" aria-label={`Rated ${tool.rating} out of 5`}>
            ★ {tool.rating}
          </span>
        )}
      </div>
      {tool.tagline && <p className="line-clamp-2 text-sm text-muted">{tool.tagline}</p>}
      <div className="mt-auto flex flex-wrap gap-1.5 text-xs">
        {tool.sponsored && <SponsoredBadge />}
        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">
          {PRICING_LABEL[tool.pricing_type]}
        </span>
        {tool.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-muted">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export function ToolLogo({ tool, size = 48 }: { tool: Pick<Tool, "name" | "logo_url">; size?: number }) {
  if (tool.logo_url) {
    return <Image src={tool.logo_url} alt="" width={size} height={size} className="shrink-0 rounded-xl" />;
  }
  return (
    <div
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-xl bg-accent/15 text-lg font-bold text-accent"
    >
      {tool.name[0]}
    </div>
  );
}

// FTC disclosure: paid placements must always carry this label.
export function SponsoredBadge() {
  return (
    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-300">
      Sponsored
    </span>
  );
}

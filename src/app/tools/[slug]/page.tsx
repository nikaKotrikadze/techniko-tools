import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SponsoredBadge, ToolCard, ToolLogo } from "@/components/ToolCard";
import { PRICING_LABEL, getPublishedTools, getRelatedTools, getTool } from "@/lib/data";
import { reelShortcode } from "@/lib/reel";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPublishedTools()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const tool = await getTool((await params).slug);
  if (!tool) return {};
  return {
    title: `${tool.name} review`,
    description: tool.tagline ?? `${tool.name}, tested and rated by @thetechniko.`,
  };
}

export default async function ToolPage({ params }: PageProps<"/tools/[slug]">) {
  const tool = await getTool((await params).slug);
  if (!tool) notFound();
  const related = await getRelatedTools(tool);
  const shortcode = tool.reel_url ? reelShortcode(tool.reel_url) : null;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-4 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          All tools
        </Link>
        {tool.category && (
          <>
            {" / "}
            <Link href={`/category/${tool.category.slug}`} className="hover:text-foreground">
              {tool.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <ToolLogo tool={tool} size={64} />
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
                {tool.tagline && <p className="mt-1 text-muted sm:text-lg">{tool.tagline}</p>}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 sm:max-w-md">
              <div className="rounded-2xl border border-border bg-card p-4">
                <dt className="text-xs text-muted">My rating</dt>
                <dd className="mt-1 text-2xl font-bold">
                  {tool.rating !== null ? (
                    <>
                      ★ {tool.rating}
                      <span className="text-base font-normal text-muted">/5</span>
                    </>
                  ) : (
                    "Not rated"
                  )}
                </dd>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <dt className="text-xs text-muted">Pricing</dt>
                <dd className="mt-1 text-2xl font-bold">{PRICING_LABEL[tool.pricing_type]}</dd>
                {tool.price_note && <dd className="text-xs text-muted">{tool.price_note}</dd>}
              </div>
            </dl>

            <div className="flex flex-col gap-2">
              <a
                href={tool.affiliate_url ?? tool.website_url}
                target="_blank"
                rel={tool.affiliate_url ? "sponsored noopener" : "noopener"}
                className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition hover:opacity-90 sm:w-auto sm:self-start dark:text-black"
              >
                Try {tool.name} →
              </a>
              {tool.affiliate_url && (
                <p className="text-xs text-muted">Affiliate link: I may earn a commission at no cost to you.</p>
              )}
            </div>

            {tool.sponsored && (
              <p className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm">
                <SponsoredBadge />
                This brand paid for a featured spot. My rating and verdict are my own.
              </p>
            )}
          </header>

          {tool.verdict && (
            <section aria-labelledby="verdict" className="rounded-2xl border-l-4 border-accent bg-card p-5">
              <h2 id="verdict" className="text-sm font-semibold tracking-wide text-accent uppercase">
                My verdict
              </h2>
              <p className="mt-2 text-lg whitespace-pre-line">{tool.verdict}</p>
            </section>
          )}

          {tool.description && (
            <section aria-labelledby="about" className="flex flex-col gap-2">
              <h2 id="about" className="text-xl font-semibold">
                About {tool.name}
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-muted">{tool.description}</p>
            </section>
          )}

          {tool.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 text-sm" aria-label="Tags">
              {tool.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-border px-3 py-1 text-muted">
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside aria-label="Video review" className="lg:sticky lg:top-6 lg:self-start">
          {shortcode ? (
            <iframe
              src={`https://www.instagram.com/reel/${shortcode}/embed/`}
              title={`@thetechniko's video review of ${tool.name}`}
              loading="lazy"
              allow="encrypted-media; picture-in-picture"
              className="mx-auto aspect-[9/16] w-full max-w-sm rounded-2xl border border-border bg-card"
            />
          ) : (
            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
              <p className="font-medium">Video review coming soon</p>
              <a href="https://instagram.com/thetechniko" className="text-sm text-accent hover:underline">
                Follow @thetechniko
              </a>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="flex flex-col gap-3">
          <h2 id="related" className="text-lg font-semibold">
            More {tool.category?.name.toLowerCase()} tools
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

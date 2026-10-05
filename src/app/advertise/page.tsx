import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Put your AI tool in front of 14K+ engaged followers of @thetechniko.",
};

const CONTACT = "business@kotrikadze.com";

// Add more from Instagram Insights (avg. reel views, top countries, age range) as { value, label }.
const STATS = [
  { value: "14K+", label: "Instagram followers" },
  { value: "AI & tech", label: "Audience interest" },
  { value: "Mobile-first", label: "Most visitors arrive from Instagram on their phones" },
];

const INCLUDED = [
  "A spot in the Featured row at the top of the home page",
  "Your own tool page with logo, pricing, and a direct \"Try it\" link",
  "Clearly labeled as Sponsored, which keeps it FTC-compliant and keeps readers' trust",
  "Optional Instagram reel review on @thetechniko (my honest take, shown on your tool page)",
];

export default function AdvertisePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-10 sm:py-16">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold tracking-wide text-accent uppercase">Media kit</p>
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          Get your AI tool in front of people who actually try AI tools
        </h1>
        <p className="text-muted sm:text-lg">
          TechNiko Tools is the directory behind @thetechniko, where I test AI tools and share honest reviews.
        </p>
      </section>

      <section aria-label="Audience" className="grid gap-3 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="included" className="flex flex-col gap-4">
        <h2 id="included" className="text-xl font-semibold">
          What a featured spot includes
        </h2>
        <ul className="flex flex-col gap-3">
          {INCLUDED.map((item) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden className="text-accent">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="rounded-xl border border-border p-4 text-sm text-muted">
          Ratings and verdicts can&apos;t be bought. A sponsored tool gets visibility, not a better review.
        </p>
      </section>

      <section className="flex flex-col items-start gap-3 rounded-2xl bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Let&apos;s talk</h2>
        <p className="text-muted">Email me with your tool, goals, and timeline, and I&apos;ll send rates and availability.</p>
        <a
          href={`mailto:${CONTACT}?subject=${encodeURIComponent("Featured spot on TechNiko Tools")}`}
          className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition hover:opacity-90 dark:text-black"
        >
          {CONTACT}
        </a>
      </section>
    </main>
  );
}

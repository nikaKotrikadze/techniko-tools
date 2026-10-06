import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Put your AI tool in front of 24K+ followers of @thetechniko across Instagram, TikTok, and Facebook.",
};

const CONTACT = "business@kotrikadze.com";

// Add more from Instagram Insights (avg. reel views, top countries, age range) as { value, label }.
const STATS = [
  { value: "14.6K", label: "Instagram followers" },
  { value: "5K", label: "TikTok followers" },
  { value: "5K", label: "Facebook followers" },
];

// Edit prices here.
const PACKAGES = [
  { name: "Reel", price: "$400", items: ["1 Instagram reel review"] },
  { name: "Reel + Cross-post", price: "$550", items: ["The reel posted on Instagram, TikTok, and Facebook"] },
  {
    name: "Full Review",
    price: "$800",
    items: [
      "Reel on all 3 platforms",
      "Permanent review page on this site with the reel embedded",
      "30 days in the Featured row on the home page",
      "Instagram Story with a link to your tool",
    ],
  },
  {
    name: "Launch",
    price: "$1,200",
    items: ["Everything in Full Review", "Feature in the newsletter", "Follow-up \"1 month later\" reel"],
  },
];

const ADD_ONS = [
  "Usage rights / whitelisting (run my reel as your ad): +40–50%",
  "Category exclusivity, no competitor reviews for 30 days: +25%",
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

      <section aria-labelledby="packages" className="flex flex-col gap-4">
        <h2 id="packages" className="text-xl font-semibold">
          Packages
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PACKAGES.map((p) => (
            <div key={p.name} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-2xl font-bold">{p.price}</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ul className="flex flex-col gap-1 text-sm text-muted">
          {ADD_ONS.map((a) => (
            <li key={a}>+ {a}</li>
          ))}
        </ul>
        <p className="rounded-xl border border-border p-4 text-sm text-muted">
          Sponsorship buys the review, not the verdict. If I don&apos;t think your tool is good, I&apos;ll tell you
          privately first and you can pull out (50% kill fee). Sponsored content is always labeled.
        </p>
      </section>

      <section className="flex flex-col items-start gap-3 rounded-2xl bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Let&apos;s talk</h2>
        <p className="text-muted">Email me with your tool, goals, and timeline, and I&apos;ll confirm availability.</p>
        <a
          href={`mailto:${CONTACT}?subject=${encodeURIComponent("Sponsorship on TechNiko Tools")}`}
          className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-white transition hover:opacity-90 dark:text-black"
        >
          {CONTACT}
        </a>
      </section>
    </main>
  );
}

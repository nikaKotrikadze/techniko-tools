import { ImageResponse } from "next/og";
import { PRICING_LABEL, getPublishedTools, getTool } from "@/lib/data";

export const alt = "Tool review on TechNiko Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getPublishedTools()).map((t) => ({ slug: t.slug }));
}

// The preview card shown when a tool page is shared (Instagram DMs, X, iMessage, etc).
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const tool = await getTool((await params).slug);
  const name = tool?.name ?? "TechNiko Tools";
  const logo = tool?.logo_url && /\.(png|jpe?g)$/i.test(tool.logo_url) ? tool.logo_url : null; // the renderer can't read WebP

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 72, background: "#0a0a0b", color: "#ededed", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
          TechNiko<span style={{ color: "#a78bfa", marginLeft: 8 }}>Tools</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {logo ? (
            <img src={logo} alt="" width={160} height={160} style={{ borderRadius: 32 }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 160, height: 160, borderRadius: 32, background: "#2e2547", color: "#a78bfa", fontSize: 88, fontWeight: 700 }}>
              {name[0]}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1 }}>{name}</div>
            {tool?.tagline && <div style={{ fontSize: 34, color: "#9ca3af" }}>{tool.tagline}</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 32 }}>
          {tool?.rating != null && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 28px", borderRadius: 999, background: "#1f1b2e" }}>
              {/* SVG star: the built-in OG font has no ★ glyph */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#fbbf24">
                <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
              </svg>
              {tool.rating}/5
            </div>}
          {tool && <div style={{ display: "flex", padding: "12px 28px", borderRadius: 999, background: "#1f1b2e" }}>{PRICING_LABEL[tool.pricing_type]}</div>}
          <div style={{ display: "flex", marginLeft: "auto", alignItems: "center", color: "#9ca3af" }}>Reviewed by @thetechniko</div>
        </div>
      </div>
    ),
    size,
  );
}

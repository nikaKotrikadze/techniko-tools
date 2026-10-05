import { ImageResponse } from "next/og";

export const alt = "TechNiko Tools: AI tools I've actually tested";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share card for every page that doesn't have its own (home, category, submit, advertise).
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: 80, background: "#0a0a0b", color: "#ededed", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>
          TechNiko<span style={{ color: "#a78bfa", marginLeft: 10 }}>Tools</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 96, fontWeight: 800, lineHeight: 1.05, marginTop: 28 }}>
          <span>AI tools I&apos;ve</span>
          <span style={{ color: "#a78bfa" }}>actually tested</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#9ca3af", marginTop: 32 }}>
          Honest ratings, pricing, and video reviews by @thetechniko
        </div>
      </div>
    ),
    size,
  );
}

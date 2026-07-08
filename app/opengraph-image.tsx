import { ImageResponse } from "next/og";
import { site } from "@/data/portfolio";

export const alt = `${site.name} — ${site.roles[0]}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Dynamically generated social share card (flexbox only — see next/og). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(1000px circle at 15% 0%, rgba(59,130,246,0.22), transparent 55%)",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#3b82f6", fontSize: 30 }}>
          ~/{site.handle}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#3b82f6",
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            {"// portfolio"}
          </div>
          <div
            style={{
              display: "flex",
              color: "#e6e6e6",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", color: "#8a8a92", fontSize: 40 }}>
            <span style={{ color: "#5a5a62", marginRight: 14 }}>&gt;</span>
            {site.roles[0]}
          </div>
        </div>

        <div style={{ display: "flex", color: "#5a5a62", fontSize: 26 }}>
          {new URL(site.url).host}
        </div>
      </div>
    ),
    { ...size },
  );
}

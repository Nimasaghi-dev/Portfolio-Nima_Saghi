import { ImageResponse } from "next/og";
import { site } from "@/data/portfolio";

export const alt = `${site.name} | ${site.roles[0]}`;
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
          background: "#0b1229",
          backgroundImage:
            "radial-gradient(1000px circle at 15% 0%, rgba(79,209,193,0.22), transparent 55%)",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#4fd1c1", fontSize: 30 }}>
          ~/{site.handle}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#4fd1c1",
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            {"// portfolio"}
          </div>
          <div
            style={{
              display: "flex",
              color: "#e6ecf7",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", color: "#b3bdd6", fontSize: 40 }}>
            <span style={{ color: "#96a2c6", marginRight: 14 }}>&gt;</span>
            {site.roles[0]}
          </div>
        </div>

        <div style={{ display: "flex", color: "#96a2c6", fontSize: 26 }}>
          {new URL(site.url).host}
        </div>
      </div>
    ),
    { ...size },
  );
}

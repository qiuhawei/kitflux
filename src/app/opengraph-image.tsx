import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0b1220 0%, #0f3d3a 48%, #0d9488 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, #14b8a6, #ea580c)",
            }}
          />
          Fluxkit
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Every token has a price
          </div>
          <div style={{ fontSize: 28, color: "rgba(248,250,252,0.78)", maxWidth: 820 }}>
            Private token counter · multi-model cost · prompt optimizer
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

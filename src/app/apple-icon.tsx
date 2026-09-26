import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background: "#0B1220",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #14B8A6 0%, #0D9488 55%, #EA580C 100%)",
            color: "#fff",
            fontSize: 72,
            fontWeight: 800,
            fontFamily: "sans-serif",
          }}
        >
          F
        </div>
      </div>
    ),
    size,
  );
}

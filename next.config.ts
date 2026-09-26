import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      { source: "/ai", destination: "/", permanent: true },
      { source: "/models", destination: "/compare", permanent: true },
      { source: "/json", destination: "/", permanent: true },
      { source: "/video", destination: "/", permanent: true },
      { source: "/tools", destination: "/", permanent: true },
      { source: "/tools/:slug", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

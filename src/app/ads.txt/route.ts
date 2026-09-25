import { siteConfig } from "@/lib/site";

export function GET() {
  if (!siteConfig.adsenseClient) {
    return new Response("# Add NEXT_PUBLIC_ADSENSE_CLIENT after AdSense approval\n", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const publisherId = siteConfig.adsenseClient.replace(/^ca-/, "");
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

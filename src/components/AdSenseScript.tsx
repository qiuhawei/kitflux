import Script from "next/script";
import { siteConfig } from "@/lib/site";

/** Loads AdSense for site verification / ads. Ad units only render when a slot id is set. */
export function AdSenseScript() {
  if (!siteConfig.adsenseClient) return null;

  return (
    <Script
      id="adsense-loader"
      async
      strategy="beforeInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClient}`}
      crossOrigin="anonymous"
    />
  );
}

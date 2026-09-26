function normalizeSiteUrl(raw: string) {
  const trimmed = raw.replace(/\/$/, "");
  try {
    const url = new URL(trimmed);
    // Production redirects apex → www; keep canonicals on www.
    if (url.hostname === "kitflux.com") {
      url.hostname = "www.kitflux.com";
    }
    return url.origin;
  } catch {
    return trimmed;
  }
}

export const siteConfig = {
  name: "Fluxkit",
  tagline: "Free online tools that just work",
  description:
    "Private AI Lab for ChatGPT & Claude: draft prompts, compare tokens across models, and estimate API cost in one workspace — plus JSON and developer utilities. No signup.",
  url: normalizeSiteUrl(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.kitflux.com",
  ),
  locale: "en_US",
  twitter: "@kitflux",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "wyhoyau@gmail.com",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-3195860835704762",
  /** Google Search Console HTML meta verification token (content= only) */
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  /** IndexNow key for Bing/Yandex faster discovery */
  indexNowKey: "kitflux-indexnow-7f3a9c2e",
} as const;

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}

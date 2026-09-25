export const siteConfig = {
  name: "Fluxkit",
  tagline: "Free online tools that just work",
  description:
    "Fast, private browser tools for developers and creators — JSON formatter, password generator, word counter, and more. No signup.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://kitflux.com",
  locale: "en_US",
  twitter: "@kitflux",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "wyhoyau@gmail.com",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "",
} as const;

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}

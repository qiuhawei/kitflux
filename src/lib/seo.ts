import { siteConfig } from "@/lib/site";

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${siteConfig.name} Token Counter`,
    url: siteConfig.url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

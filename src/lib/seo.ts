import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { ToolDefinition } from "@/lib/tools";

export function buildToolMetadata(tool: ToolDefinition): Metadata {
  const title = `${tool.name} — Free Online Tool`;
  const url = absoluteUrl(`/tools/${tool.slug}`);

  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${tool.name} | ${siteConfig.name}`,
      description: tool.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} | ${siteConfig.name}`,
      description: tool.description,
    },
  };
}

export function toolJsonLd(tool: ToolDefinition) {
  const url = absoluteUrl(`/tools/${tool.slug}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: tool.name,
        url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: tool.description,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: absoluteUrl("/#tools"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.shortName,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

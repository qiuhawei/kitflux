import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";
import type { ToolDefinition } from "@/lib/tools";
import { tools } from "@/lib/tools";

export function buildToolMetadata(tool: ToolDefinition): Metadata {
  const primaryKeyword = tool.keywords[0] ?? tool.shortName;
  const title = `${tool.name} (Free)`;
  const url = absoluteUrl(`/tools/${tool.slug}`);

  return {
    title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${primaryKeyword} | ${siteConfig.name}`,
      description: tool.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${primaryKeyword} | ${siteConfig.name}`,
      description: tool.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
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
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: tool.description,
        featureList: tool.guide.tips,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "HowTo",
        name: tool.guide.heading,
        description: tool.guide.intro,
        step: tool.guide.steps.map((text, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          text,
        })),
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
            item: absoluteUrl("/tools"),
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
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
      {
        "@type": "ItemList",
        name: `${siteConfig.name} tools`,
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: absoluteUrl(`/tools/${tool.slug}`),
        })),
      },
    ],
  };
}

export function toolsIndexJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `All free tools — ${siteConfig.name}`,
    url: absoluteUrl("/tools"),
    description: `Browse all ${tools.length} free browser tools on ${siteConfig.name}.`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/tools/${tool.slug}`),
        name: tool.name,
      })),
    },
  };
}

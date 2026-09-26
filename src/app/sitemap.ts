import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { guides } from "@/lib/guides";
import { DEPRECATIONS } from "@/lib/deprecations";
import { SYSTEM_PROMPTS } from "@/lib/systemPrompts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/system-prompts"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.99,
    },
    {
      url: absoluteUrl("/deprecations"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.98,
    },
    {
      url: absoluteUrl("/compare"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.97,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.96,
    },
    ...SYSTEM_PROMPTS.map((item) => ({
      url: absoluteUrl(`/system-prompts/${item.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...DEPRECATIONS.map((item) => ({
      url: absoluteUrl(`/deprecations/${item.slug}`),
      lastModified: new Date(item.shutdown),
      changeFrequency: "weekly" as const,
      priority: 0.88,
    })),
    ...guides.map((guide) => ({
      url: absoluteUrl(`/guides/${guide.slug}`),
      lastModified: new Date(guide.updated),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}

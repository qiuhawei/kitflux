import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { guides } from "@/lib/guides";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/ai"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.99,
    },
    {
      url: absoluteUrl("/guides"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.97,
    },
    {
      url: absoluteUrl("/models"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.98,
    },
    {
      url: absoluteUrl("/json"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.98,
    },
    {
      url: absoluteUrl("/video"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.96,
    },
    {
      url: absoluteUrl("/tools"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}`),
    lastModified: new Date(guide.updated),
    changeFrequency: "monthly",
    priority: 0.88,
  }));

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: absoluteUrl(`/tools/${tool.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: tool.slug === "ai-lab" || tool.category === "ai" ? 0.96 : 0.9,
  }));

  return [...staticRoutes, ...guideRoutes, ...toolRoutes];
}

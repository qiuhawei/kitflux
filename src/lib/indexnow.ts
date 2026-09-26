import { absoluteUrl, siteConfig } from "@/lib/site";
import { guides } from "@/lib/guides";
import { DEPRECATIONS } from "@/lib/deprecations";
import { SYSTEM_PROMPTS } from "@/lib/systemPrompts";

/** All public URLs we want search engines to discover quickly. */
export function allIndexableUrls() {
  return [
    absoluteUrl("/"),
    absoluteUrl("/compare"),
    absoluteUrl("/system-prompts"),
    absoluteUrl("/system-prompts/compare"),
    absoluteUrl("/deprecations"),
    absoluteUrl("/guides"),
    ...SYSTEM_PROMPTS.map((item) => absoluteUrl(`/system-prompts/${item.slug}`)),
    ...DEPRECATIONS.map((item) => absoluteUrl(`/deprecations/${item.slug}`)),
    ...guides.map((guide) => absoluteUrl(`/guides/${guide.slug}`)),
    absoluteUrl("/about"),
    absoluteUrl("/contact"),
    absoluteUrl("/privacy"),
    absoluteUrl("/terms"),
  ];
}

/**
 * Notify Bing/Yandex/etc via IndexNow (Google uses Search Console instead).
 * Safe to call after deploy; failures are ignored.
 */
export async function pingIndexNow(urls: string[] = allIndexableUrls()) {
  const host = new URL(siteConfig.url).host;
  const key = siteConfig.indexNowKey;
  const keyLocation = absoluteUrl(`/${key}.txt`);

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  // IndexNow accepts up to 10k; batch by 100 for safer payloads.
  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += 100) {
    chunks.push(urls.slice(i, i + 100));
  }

  await Promise.allSettled(
    chunks.flatMap((urlList) =>
      endpoints.map((endpoint) =>
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            host,
            key,
            keyLocation,
            urlList,
          }),
        }),
      ),
    ),
  );
}

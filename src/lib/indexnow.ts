import { absoluteUrl, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

/** All public URLs we want search engines to discover quickly. */
export function allIndexableUrls() {
  return [
    absoluteUrl("/"),
    absoluteUrl("/tools"),
    absoluteUrl("/about"),
    absoluteUrl("/contact"),
    absoluteUrl("/privacy"),
    absoluteUrl("/terms"),
    ...tools.map((tool) => absoluteUrl(`/tools/${tool.slug}`)),
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

  const body = {
    host,
    key,
    keyLocation,
    urlList: urls.slice(0, 100),
  };

  await Promise.allSettled(
    endpoints.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      }),
    ),
  );
}

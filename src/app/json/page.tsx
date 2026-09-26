import type { Metadata } from "next";
import Link from "next/link";
import { JsonStudioClient } from "@/components/tools/JsonStudioClient";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "JSON Online Formatter & Validator",
  description:
    "Free online JSON parser, formatter, compressor, and tree viewer. Validate JSON in your browser — private, fast, no upload. Like a clean JSON.cn-style studio.",
  keywords: [
    "json formatter",
    "json online",
    "json validator",
    "json parser",
    "json.cn",
    "pretty print json",
    "json tree view",
  ],
  alternates: { canonical: absoluteUrl("/json") },
  openGraph: {
    title: `JSON Formatter | ${siteConfig.name}`,
    description:
      "Format, compress, escape, and explore JSON with a tree view — all in your browser.",
    url: absoluteUrl("/json"),
  },
};

export default function JsonPage() {
  return (
    <div className="json-page">
      <div className="json-page-top shell">
        <div>
          <p className="eyebrow">JSON studio</p>
          <h1>JSON online formatter &amp; validator</h1>
          <p className="lede">
            Paste JSON to format, compress, escape, or browse as a tree. Everything runs locally —
            nothing is uploaded.
          </p>
        </div>
        <Link href="/tools" className="btn btn-secondary">
          All tools
        </Link>
      </div>
      <div className="shell">
        <AdSlot format="horizontal" />
      </div>
      <div className="shell json-page-studio">
        <JsonStudioClient />
      </div>
      <article className="shell prose-narrow json-page-copy">
        <h2>What you can do</h2>
        <ul>
          <li>Beautify and validate JSON with clear error messages</li>
          <li>Compress / minify for APIs and payloads</li>
          <li>Escape / unescape strings for embedding</li>
          <li>Inspect structure in a collapsible tree and copy JSON paths</li>
          <li>
            Load via hash params: <code>#data=&#123;"a":1&#125;</code> or{" "}
            <code>#url=https://example.com/data.json</code>
          </li>
          <li>
            Focus mode: add <code>?fullscreen=1</code>
          </li>
        </ul>
      </article>
    </div>
  );
}

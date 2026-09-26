import type { Metadata } from "next";
import Link from "next/link";
import { JsonStudioClient } from "@/components/tools/JsonStudioClient";
import { PortalGrid } from "@/components/PortalGrid";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { AdSlot } from "@/components/AdSlot";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "JSON Online Formatter & Validator",
  description:
    "Free online JSON parser, formatter, compressor, validator, sorter, YAML/CSV/TS converters, JWT decoder, and tree viewer. Private — nothing uploaded.",
  keywords: [
    "json formatter",
    "json online",
    "json validator",
    "json parser",
    "json.cn",
    "pretty print json",
    "json tree view",
    "json to yaml",
    "jwt decoder",
  ],
  alternates: { canonical: absoluteUrl("/json") },
  openGraph: {
    title: `JSON Formatter | ${siteConfig.name}`,
    description:
      "Format, compress, convert, and explore JSON — plus a full suite of companion tools in your browser.",
    url: absoluteUrl("/json"),
  },
};

export default function JsonPage() {
  const jsonTools = tools.filter((tool) => tool.category === "json");

  return (
    <div className="json-page">
      <div className="json-page-top shell">
        <div>
          <p className="eyebrow">JSON suite</p>
          <h1>JSON online formatter &amp; tools</h1>
          <p className="lede">
            Format, validate, compress, sort, convert, and decode — {jsonTools.length} JSON
            utilities, all local in your browser.
          </p>
        </div>
        <Link href="/tools?cat=json" className="btn btn-secondary">
          All JSON tools
        </Link>
      </div>

      <div className="shell">
        <section className="portal-section json-suite-grid">
          <div className="portal-section-head">
            <h2>JSON tools</h2>
            <p>Pick a specialist tool, or scroll down for the full studio.</p>
          </div>
          <PortalGrid
            tools={jsonTools}
            hrefFor={(tool) =>
              tool.slug === "json-formatter" ? "#studio" : `/tools/${tool.slug}`
            }
          />
        </section>
      </div>

      <div className="shell">
        <AdSlot format="horizontal" />
      </div>

      <div className="shell json-page-studio" id="studio">
        <JsonStudioClient />
      </div>

      <article className="shell prose-narrow json-page-copy">
        <h2>What you can do</h2>
        <ul>
          <li>Beautify and validate JSON with clear error messages</li>
          <li>Compress / minify for APIs and payloads</li>
          <li>Sort keys, escape strings, and compare two documents</li>
          <li>Convert to YAML, CSV, or TypeScript types</li>
          <li>Decode JWT header and payload claims locally</li>
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

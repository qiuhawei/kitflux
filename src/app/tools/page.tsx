import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { toolsIndexJsonLd } from "@/lib/seo";
import { categories, tools, type ToolCategory } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: `Browse all ${tools.length} free browser tools on ${siteConfig.name}: JSON formatter, password generator, word counter, Base64, UUID, and more.`,
  alternates: { canonical: absoluteUrl("/tools") },
};

const categoryOrder: ToolCategory[] = ["developer", "text", "security", "time"];

export default function ToolsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsIndexJsonLd()) }}
      />
      <div className="shell tool-page">
        <header className="tool-header">
          <p className="eyebrow">Directory</p>
          <h1>All free online tools</h1>
          <p className="lede">
            Every {siteConfig.name} utility runs in your browser. Pick a tool below — no account,
            no upload.
          </p>
        </header>

        {categoryOrder.map((category) => {
          const items = tools.filter((tool) => tool.category === category);
          if (!items.length) return null;
          return (
            <section key={category} className="category-block">
              <h2>{categories[category].label}</h2>
              <p className="category-desc">{categories[category].description}</p>
              <div className="tool-grid">
                {items.map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card">
                    <span className="cat">{categories[tool.category].label}</span>
                    <strong>{tool.shortName}</strong>
                    <span>{tool.description}</span>
                    <span className="go">Open tool →</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

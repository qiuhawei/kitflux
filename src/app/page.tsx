import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { CategoryChips, PortalGrid } from "@/components/PortalGrid";
import { homeJsonLd } from "@/lib/seo";
import { categories, categoryOrder, tools } from "@/lib/tools";

export default function HomePage() {
  const counts = {
    all: tools.length,
    ...Object.fromEntries(
      categoryOrder.map((category) => [
        category,
        tools.filter((tool) => tool.category === category).length,
      ]),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />

      <section className="hero hero-compact">
        <div className="shell">
          <div className="hero-copy">
            <p className="hero-brand">Fluxkit</p>
            <h1>Free AI &amp; developer tools that stay private.</h1>
            <p className="lede">
              {tools.length} browser utilities — JSON suite, AI token helpers, and everyday
              converters. No account. No upload.
            </p>
            <div className="hero-actions">
              <Link href="/tools" className="btn btn-primary">
                Browse all tools
              </Link>
              <Link href="/json" className="btn btn-secondary">
                Open JSON studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="shell portal-home">
        <CategoryChips active="all" counts={counts} />
        <AdSlot format="horizontal" />

        {categoryOrder.map((category) => {
          const items = tools.filter((tool) => tool.category === category);
          if (!items.length) return null;
          return (
            <section key={category} className="portal-section">
              <div className="portal-section-head">
                <h2>{categories[category].label}</h2>
                <p>{categories[category].description}</p>
              </div>
              <PortalGrid
                tools={items}
                hrefFor={(tool) =>
                  tool.slug === "json-formatter" ? "/json" : `/tools/${tool.slug}`
                }
              />
            </section>
          );
        })}
      </div>
    </>
  );
}

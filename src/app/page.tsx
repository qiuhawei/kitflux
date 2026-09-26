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

      <section className="hero hero-stage">
        <div className="hero-atmosphere" aria-hidden>
          <span className="hero-orb hero-orb-a" />
          <span className="hero-orb hero-orb-b" />
          <span className="hero-orb hero-orb-c" />
          <div className="hero-stage-panel">
            <pre className="hero-stage-code">{`{
  "private": true,
  "upload": false,
  "tools": ${tools.length}
}`}</pre>
          </div>
        </div>

        <div className="shell hero-stage-content">
          <p className="hero-brand">Fluxkit</p>
          <h1>Tools that feel instant — and stay on your device.</h1>
          <p className="lede">
            JSON, video covers, AI helpers, and everyday converters. Free, fast, no account.
          </p>
          <div className="hero-actions">
            <Link href="/tools" className="btn btn-primary">
              Explore {tools.length} tools
            </Link>
            <Link href="/json" className="btn btn-secondary">
              Open JSON studio
            </Link>
          </div>
        </div>
      </section>

      <div className="shell portal-home">
        <div className="portal-rail">
          <div>
            <h2 className="portal-rail-title">Browse the kit</h2>
            <p className="portal-rail-copy">Pick a category — every tool opens in one click.</p>
          </div>
          <CategoryChips active="all" counts={counts} />
        </div>

        <AdSlot format="horizontal" />

        {categoryOrder.map((category) => {
          const items = tools.filter((tool) => tool.category === category);
          if (!items.length) return null;
          return (
            <section key={category} className="portal-section" id={`cat-${category}`}>
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

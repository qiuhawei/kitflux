import type { Metadata } from "next";
import Link from "next/link";
import { CategoryChips, PortalGrid } from "@/components/PortalGrid";
import { AdSlot } from "@/components/AdSlot";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { toolsIndexJsonLd } from "@/lib/seo";
import {
  categories,
  categoryOrder,
  tools,
  type ToolCategory,
} from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: `Browse all ${tools.length} free browser tools on ${siteConfig.name}: JSON suite, AI token counter, prompt builder, password generator, and more.`,
  alternates: { canonical: absoluteUrl("/tools") },
};

type Props = {
  searchParams: Promise<{ cat?: string }>;
};

export default async function ToolsIndexPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const active: ToolCategory | "all" =
    cat && cat in categories ? (cat as ToolCategory) : "all";

  const counts: Partial<Record<ToolCategory | "all", number>> = {
    all: tools.length,
  };
  for (const tool of tools) {
    counts[tool.category] = (counts[tool.category] ?? 0) + 1;
  }

  const visible =
    active === "all" ? tools : tools.filter((tool) => tool.category === active);

  const sections =
    active === "all"
      ? categoryOrder
          .map((category) => ({
            category,
            items: tools.filter((tool) => tool.category === category),
          }))
          .filter((section) => section.items.length)
      : [{ category: active, items: visible }];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsIndexJsonLd()) }}
      />
      <div className="shell portal-page">
        <header className="portal-header">
          <div>
            <p className="eyebrow">Directory</p>
            <h1>All free online tools</h1>
            <p className="lede">
              {tools.length} utilities on {siteConfig.name} — JSON suite, AI helpers, and everyday
              developer tools. Everything runs in your browser.
            </p>
          </div>
          <Link href="/json" className="btn btn-secondary">
            JSON studio
          </Link>
        </header>

        <CategoryChips active={active} counts={counts} />

        <AdSlot format="horizontal" />

        {sections.map(({ category, items }) => (
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
        ))}
      </div>
    </>
  );
}

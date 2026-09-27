import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ModelsDirectory } from "@/components/ModelsDirectory";
import { MODELS_UPDATED, PRICE_MODELS, PROVIDERS } from "@/lib/aiLab";
import {
  blendedPerMillion,
  cheapestModels,
  formatUsd,
  largestContextModels,
  modelHref,
} from "@/lib/modelDirectory";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Models — Price, Context & Side-by-Side Compare",
  description:
    "Compare AI models by planning price and context window. Filter by provider, sort by cost, and open a model page to weigh a real prompt.",
  keywords: [
    "ai model comparison",
    "llm pricing",
    "context window comparison",
    "gpt vs claude cost",
    "cheapest llm api",
  ],
  alternates: { canonical: absoluteUrl("/models") },
  openGraph: {
    title: `AI Models | ${siteConfig.name}`,
    description: "Price and context comparison across major language models.",
    url: absoluteUrl("/models"),
  },
};

export default function ModelsPage() {
  const cheap = cheapestModels(3);
  const wide = largestContextModels(3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI model price and context directory",
    url: absoluteUrl("/models"),
    description: "Planning prices and context windows for major language models.",
    numberOfItems: PRICE_MODELS.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell portal-page">
        <header className="page-head">
          <div>
            <p className="eyebrow">Models</p>
            <h1>Compare models on price and context</h1>
            <p className="lede">
              {PRICE_MODELS.length} models · {PROVIDERS.length} providers. Catalog updated{" "}
              {MODELS_UPDATED}. Sort the directory, compare up to four, then weigh your prompt in
              the <Link href="/">token counter</Link>.
            </p>
          </div>
          <Link href="/" className="btn btn-primary">
            Weigh a prompt
          </Link>
        </header>

        <div className="detail-grid" style={{ marginBottom: "1.25rem" }}>
          <section className="detail-panel">
            <h2>Lowest blended price</h2>
            <ul>
              {cheap.map((model) => (
                <li key={model.id}>
                  <Link href={modelHref(model)}>{model.label}</Link>
                  <span className="wx-muted"> · {formatUsd(blendedPerMillion(model))}/1M</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-panel">
            <h2>Largest context</h2>
            <ul>
              {wide.map((model) => (
                <li key={model.id}>
                  <Link href={modelHref(model)}>{model.label}</Link>
                  <span className="wx-muted">
                    {" "}
                    · {model.contextWindow.toLocaleString()} tokens
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <AdSlot format="horizontal" />
        <ModelsDirectory />
      </div>
    </>
  );
}

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
  title: "LLM API Prices and Context Windows",
  description:
    "API price per 1M tokens, context window, and which prompts use each model. Sort by cost and open a model to weigh your prompt.",
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
            <h1>LLM API prices and context windows</h1>
            <p className="lede">
              {PRICE_MODELS.length} models · {PROVIDERS.length} providers · updated {MODELS_UPDATED}.
              Cheapest now:{" "}
              {cheap.map((model, index) => (
                <span key={model.id}>
                  {index > 0 ? ", " : ""}
                  <Link href={modelHref(model)}>
                    {model.label} {formatUsd(blendedPerMillion(model))}/1M
                  </Link>
                </span>
              ))}
              . Largest context:{" "}
              {wide.map((model, index) => (
                <span key={model.id}>
                  {index > 0 ? ", " : ""}
                  <Link href={modelHref(model)}>
                    {model.label} {model.contextWindow.toLocaleString()}
                  </Link>
                </span>
              ))}
              .
            </p>
          </div>
          <Link href="/" className="btn btn-primary">
            Weigh a prompt
          </Link>
        </header>

        <AdSlot format="horizontal" />
        <ModelsDirectory />
      </div>
    </>
  );
}

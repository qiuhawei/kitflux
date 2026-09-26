import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PRICE_MODELS, PROVIDERS, MODELS_UPDATED } from "@/lib/aiLab";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Model Pricing Compare — GPT, Claude, DeepSeek, Grok",
  description:
    "Compare planning API prices and context windows for GPT, Claude, Gemini, DeepSeek, Grok, Mistral, and Llama. Then weigh your real prompt on Fluxkit.",
  keywords: [
    "ai model pricing comparison",
    "deepseek vs gpt cost",
    "claude vs chatgpt pricing",
    "grok api pricing",
    "llm price table",
  ],
  alternates: { canonical: absoluteUrl("/compare") },
  openGraph: {
    title: `Compare Models | ${siteConfig.name}`,
    description: "Side-by-side planning prices and context windows.",
    url: absoluteUrl("/compare"),
  },
};

export default function ComparePage() {
  const sorted = [...PRICE_MODELS].sort(
    (a, b) => a.inputPerMillion - b.inputPerMillion,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Model Pricing Compare",
    url: absoluteUrl("/compare"),
    description: "Planning price and context comparison across major LLM APIs.",
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
            <p className="eyebrow">Compare</p>
            <h1>AI model pricing & context</h1>
            <p className="lede">
              {PRICE_MODELS.length} planning tiers across {PROVIDERS.length} providers. Catalog
              updated {MODELS_UPDATED}. Sticker prices lie without your prompt — open the{" "}
              <Link href="/">token counter</Link> to weigh a real draft.
            </p>
          </div>
          <Link href="/" className="btn btn-primary">
            Weigh a prompt
          </Link>
        </header>

        <AdSlot format="horizontal" />

        <div className="model-table-wrap">
          <table className="model-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Provider</th>
                <th>Input $/1M</th>
                <th>Output $/1M</th>
                <th>Context</th>
                <th>Tokenizer</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((model) => (
                <tr key={model.id}>
                  <td>
                    <strong>{model.label}</strong>
                    <span className="model-family">{model.family}</span>
                  </td>
                  <td>{model.provider}</td>
                  <td>${model.inputPerMillion}</td>
                  <td>${model.outputPerMillion}</td>
                  <td>{model.contextWindow.toLocaleString()}</td>
                  <td>{model.exact ? "Exact (browser)" : "Estimate"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <article className="prose-narrow" style={{ marginTop: "1.5rem" }}>
          <h2>How to use this table</h2>
          <p>
            Sort mentally by job: cheap Flash/DeepSeek tiers for high-volume classification;
            frontier models for hard reasoning. Then paste a production prompt into Fluxkit and
            read the live cost chart — tokenization differs by family, so the same English can bill
            differently.
          </p>
          <p>
            Rates change. Treat these as planning defaults and confirm on vendor pricing pages
            before you lock a budget.
          </p>
        </article>
      </div>
    </>
  );
}

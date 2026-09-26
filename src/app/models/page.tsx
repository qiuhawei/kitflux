import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ModelPricingTool } from "@/components/tools/ModelPricingTool";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PRICE_MODELS } from "@/lib/aiLab";

export const metadata: Metadata = {
  title: "AI Model Pricing Compare — GPT, Claude, DeepSeek, Grok",
  description:
    "Compare estimated API cost for one prompt across GPT, Claude, Gemini, DeepSeek, Grok, and Mistral. Private browser calculator — planning defaults, not invoices.",
  keywords: [
    "ai model pricing comparison",
    "deepseek vs gpt cost",
    "grok api pricing calculator",
    "claude vs chatgpt cost",
    "cheapest llm api",
  ],
  alternates: { canonical: absoluteUrl("/models") },
  openGraph: {
    title: `Model Pricing | ${siteConfig.name}`,
    description: "Same prompt, ranked cost across major LLM APIs.",
    url: absoluteUrl("/models"),
  },
};

export default function ModelsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fluxkit Model Pricing Compare",
    url: absoluteUrl("/models"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "Compare planning API costs for GPT, Claude, Gemini, DeepSeek, Grok, and Mistral on one private prompt.",
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
            <p className="eyebrow">2026 cost reality</p>
            <h1>AI model pricing — same prompt, many price tags</h1>
            <p className="lede">
              Top-traffic AI products (ChatGPT, Claude, Gemini, DeepSeek, Grok) set the demand.
              Fluxkit answers the builder question those chats create: what does <em>my</em> draft
              cost across APIs — privately, in the browser.
            </p>
          </div>
          <Link href="/ai" className="btn btn-primary">
            Open AI Lab
          </Link>
        </header>

        <AdSlot format="horizontal" />

        <ModelPricingTool />

        <article className="prose-narrow ai-copy">
          <h2>Why this page exists</h2>
          <p>
            High-traffic AI sites win attention; utility sites win the “before I call the API”
            intent. Public developer discussion in 2026 hammered DeepSeek’s cheap long context
            versus premium agent pricing (including Grok long-prompt tiers). This table is an
            original Fluxkit planning surface — not scraped copy from another counter.
          </p>
          <p>
            Planning tiers currently include {PRICE_MODELS.length} models. Confirm live rates on
            vendor pages before you lock a budget. Next:{" "}
            <Link href="/tools/prompt-optimizer">optimize the prompt</Link>,{" "}
            <Link href="/tools/context-window">check context fill</Link>, or read{" "}
            <Link href="/guides/deepseek-vs-gpt-api-cost">DeepSeek vs GPT cost</Link>.
          </p>
        </article>
      </div>
    </>
  );
}

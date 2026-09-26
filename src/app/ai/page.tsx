import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PortalGrid } from "@/components/PortalGrid";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "AI Tools — ChatGPT Token Counter, Prompt Builder & API Cost",
  description:
    "Free AI tools for ChatGPT, Claude, and Gemini: token counter, prompt builder, and API cost calculator. Private browser utilities — no signup, nothing uploaded.",
  keywords: [
    "ai tools",
    "chatgpt token counter",
    "claude token counter",
    "ai prompt builder",
    "openai cost calculator",
    "llm tools",
    "free chatgpt tools",
  ],
  alternates: { canonical: absoluteUrl("/ai") },
  openGraph: {
    title: `AI Tools | ${siteConfig.name}`,
    description:
      "Token counters, prompt builders, and API cost planners for ChatGPT, Claude, and Gemini.",
    url: absoluteUrl("/ai"),
  },
};

export default function AiHubPage() {
  const aiTools = tools.filter((tool) => tool.category === "ai");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `AI Tools — ${siteConfig.name}`,
    url: absoluteUrl("/ai"),
    description:
      "Free AI utilities for ChatGPT, Claude, and Gemini token counting, prompt writing, and API cost planning.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: aiTools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: tool.name,
        url: absoluteUrl(`/tools/${tool.slug}`),
      })),
    },
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
            <p className="eyebrow">AI suite</p>
            <h1>AI tools for ChatGPT, Claude &amp; Gemini</h1>
            <p className="lede">
              Count tokens, build stronger prompts, and estimate API spend — {aiTools.length}{" "}
              free utilities that stay in your browser.
            </p>
          </div>
          <Link href="/tools/ai-token-counter" className="btn btn-primary">
            Open token counter
          </Link>
        </header>

        <AdSlot format="horizontal" />

        <section className="portal-section">
          <div className="portal-section-head">
            <h2>All AI tools</h2>
            <p>Tokens · prompts · API cost</p>
          </div>
          <PortalGrid tools={aiTools} />
        </section>

        <article className="prose-narrow ai-copy">
          <h2>Why AI token counting matters</h2>
          <p>
            ChatGPT, Claude, and Gemini all meter usage in <strong>tokens</strong>, not words.
            Knowing your prompt size before you hit send helps you avoid context overflows,
            truncated answers, and surprise API bills. Fluxkit’s{" "}
            <Link href="/tools/ai-token-counter">AI Token Counter</Link> gives a fast local
            estimate so you can trim system prompts and chat history with confidence.
          </p>

          <h2>Build prompts that models actually follow</h2>
          <p>
            Strong prompts usually include a role, a clear task, constraints, and an output
            format. The <Link href="/tools/prompt-builder">AI Prompt Builder</Link> turns that
            pattern into paste-ready text for ChatGPT or Claude — without calling any model on
            our servers.
          </p>

          <h2>Plan LLM API budgets early</h2>
          <p>
            Once you know typical input and output sizes, use the{" "}
            <Link href="/tools/ai-cost-calculator">AI Cost Calculator</Link> to forecast OpenAI-
            or Claude-style spend for a day, a week, or a product launch. Pair it with the token
            counter on real sample prompts for better numbers.
          </p>

          <h2>Private by design</h2>
          <p>
            These AI utilities run in your browser. We do not require an account, and we do not
            upload your prompts for token counting or prompt building. Need JSON or video helpers
            too? Browse the <Link href="/json">JSON studio</Link> or{" "}
            <Link href="/tools">full tool directory</Link>.
          </p>
        </article>
      </div>
    </>
  );
}

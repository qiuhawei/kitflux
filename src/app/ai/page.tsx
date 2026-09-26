import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PortalGrid } from "@/components/PortalGrid";
import { AiLabTool } from "@/components/tools/AiLabTool";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "AI Lab — Prompt + Token Compare + Cost (Private)",
  description:
    "Fluxkit AI Lab: build a ChatGPT/Claude prompt, compare GPT vs Claude vs Gemini tokens side-by-side, and estimate API cost in one private browser workspace. Not just another token counter.",
  keywords: [
    "ai lab",
    "chatgpt token cost calculator",
    "compare gpt claude tokens",
    "prompt workspace",
    "private ai tools",
    "llm cost estimator",
  ],
  alternates: { canonical: absoluteUrl("/ai") },
  openGraph: {
    title: `AI Lab | ${siteConfig.name}`,
    description:
      "One private workspace: prompt drafting, multi-model token compare, and API cost forecast.",
    url: absoluteUrl("/ai"),
  },
};

export default function AiHubPage() {
  const aiTools = tools.filter((tool) => tool.category === "ai");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Fluxkit AI Lab",
        url: absoluteUrl("/ai"),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description:
          "Private browser workspace to draft prompts, compare tokens across GPT/Claude/Gemini, and estimate API cost.",
      },
      {
        "@type": "ItemList",
        name: "AI tools",
        itemListElement: aiTools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: absoluteUrl(`/tools/${tool.slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="ai-lab-page">
        <div className="shell page-head">
          <div>
            <p className="eyebrow">Differentiation</p>
            <h1>AI Lab — not another lone token counter</h1>
            <p className="lede">
              Competitors sell one widget. Fluxkit connects prompt drafting, multi-model token
              compare, and cost forecast in one private workspace.
            </p>
          </div>
          <Link href="/tools/ai-lab" className="btn btn-secondary">
            Tool page + guide
          </Link>
        </div>

        <div className="shell">
          <AdSlot format="horizontal" />
        </div>

        <div className="shell ai-lab-embed">
          <AiLabTool />
        </div>

        <div className="shell portal-page">
          <section className="portal-section">
            <div className="portal-section-head">
              <h2>Also available solo</h2>
              <p>Focused landing pages when you only need one job.</p>
            </div>
            <PortalGrid
              tools={aiTools}
              hrefFor={(tool) => (tool.slug === "ai-lab" ? "/ai" : `/tools/${tool.slug}`)}
            />
          </section>

          <article className="prose-narrow ai-copy">
            <h2>Why this is differentiated</h2>
            <ul>
              <li>
                <strong>Workflow, not widgets</strong> — one draft drives tokens and cost together
              </li>
              <li>
                <strong>Multi-model compare</strong> — GPT / Claude / Gemini / DeepSeek / Grok /
                Mistral estimates side-by-side
              </li>
              <li>
                <strong>Local optimize</strong> — cut filler tokens without uploading a rewrite
              </li>
              <li>
                <strong>Shareable hashes</strong> — <code>#prompt=</code> links open the same draft
                locally (no upload)
              </li>
              <li>
                <strong>Local history</strong> — revisit drafts without creating an account
              </li>
            </ul>
            <p>
              New here? Try{" "}
              <Link href="/models">model pricing</Link>, the{" "}
              <Link href="/tools/prompt-optimizer">prompt optimizer</Link>,{" "}
              <Link href="/tools/context-window">context window</Link>, or guides on{" "}
              <Link href="/guides/deepseek-vs-gpt-api-cost">DeepSeek vs GPT</Link> and{" "}
              <Link href="/guides/prompt-optimizer-cut-tokens">token cuts</Link>.
            </p>
          </article>
        </div>
      </div>
    </>
  );
}

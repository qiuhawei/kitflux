import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PromptWorkspace } from "@/components/workspace/PromptWorkspace";
import { guides } from "@/lib/guides";
import { PRICE_MODELS, PROVIDERS } from "@/lib/aiLab";
import { absoluteUrl, siteConfig } from "@/lib/site";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${siteConfig.name} Token Counter & Cost Calculator`,
        url: siteConfig.url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: siteConfig.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is my prompt uploaded?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Tokenization, cost estimates, optimization, versions, and history run in your browser.",
            },
          },
          {
            "@type": "Question",
            name: "How accurate are token counts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "OpenAI-family models use an in-browser gpt-tokenizer for exact counts. Other providers use labeled approximations for planning.",
            },
          },
          {
            "@type": "Question",
            name: "Can I compare costs across models?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The sidebar ranks the same prompt across all supported models by estimated total cost.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PromptWorkspace />

      <div className="wx-below">
        <AdSlot format="horizontal" />

        <h2>How it works</h2>
        <p className="lede">
          Three steps from raw text to a planning cost estimate — inspired by the best prompt
          weighers, built as an original Fluxkit workspace.
        </p>
        <div className="wx-feature-grid">
          <article>
            <h3>1. Paste your prompt</h3>
            <p>
              Single prompt or multi-turn conversation. Use {"{{variables}}"} and resolve them
              before counting.
            </p>
          </article>
          <article>
            <h3>2. Pick a model</h3>
            <p>
              {PRICE_MODELS.length} models across {PROVIDERS.length} providers. Exact browser
              tokenization for GPT-family; estimates elsewhere, clearly labeled.
            </p>
          </article>
          <article>
            <h3>3. Read cost + fill</h3>
            <p>
              Adjust output ratio, compare the chart, optimize filler, then export curl / Python /
              Node snippets.
            </p>
          </article>
        </div>

        <h2>Built for the weigh-and-ship workflow</h2>
        <div className="wx-feature-grid">
          <article>
            <h3>Exact + estimate counting</h3>
            <p>gpt-tokenizer in the browser for OpenAI-style models; smart approximations for Claude, Gemini, Grok, DeepSeek, and more.</p>
          </article>
          <article>
            <h3>Multi-model cost compare</h3>
            <p>
              Side-by-side ranking so you can see when DeepSeek or Flash beats a frontier model on
              the same draft.
            </p>
          </article>
          <article>
            <h3>Context predictor</h3>
            <p>Live fill meter against each model’s planning context window before you overflow.</p>
          </article>
          <article>
            <h3>Optimizer + tips</h3>
            <p>Local filler cleanup with undo, plus actionable tips on format, length, and reasoning.</p>
          </article>
          <article>
            <h3>Heatmap</h3>
            <p>Spot dense regions that usually repay trimming first.</p>
          </article>
          <article>
            <h3>Share & versions</h3>
            <p>
              <code>#prompt=</code> hash links, local versions, snippets, and history — no account.
            </p>
          </article>
        </div>

        <div className="page-head">
          <div>
            <p className="eyebrow">Learn</p>
            <h2>Guides that funnel into the workspace</h2>
          </div>
          <Link href="/guides" className="btn btn-secondary">
            All guides
          </Link>
        </div>
        <div className="guide-list">
          {guides.slice(0, 4).map((guide) => (
            <article key={guide.slug} className="guide-card">
              <p className="guide-meta">
                {guide.readingMinutes} min · Updated {guide.updated}
              </p>
              <h2>
                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p>{guide.description}</p>
              <Link href={`/guides/${guide.slug}`} className="guide-card-go">
                Read guide →
              </Link>
            </article>
          ))}
        </div>

        <h2 style={{ marginTop: "2rem" }}>FAQ</h2>
        <div className="faq-list">
          <details>
            <summary>Is Fluxkit free?</summary>
            <p>Yes. No signup, no API key required for counting and planning estimates.</p>
          </details>
          <details>
            <summary>Do you store prompts on a server?</summary>
            <p>
              No. Calculations and localStorage history stay on your device. Hash share links keep
              the draft in the URL fragment.
            </p>
          </details>
          <details>
            <summary>Where do prices come from?</summary>
            <p>
              Planning defaults. Always confirm live rates on the provider’s pricing page — see also{" "}
              <Link href="/compare">model compare</Link>.
            </p>
          </details>
        </div>
      </div>
    </>
  );
}

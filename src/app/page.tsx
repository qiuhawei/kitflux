import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { PromptWorkspace } from "@/components/workspace/PromptWorkspace";
import { guides } from "@/lib/guides";
import { PRICE_MODELS, PROVIDERS } from "@/lib/aiLab";
import { siteConfig } from "@/lib/site";

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
              text: "No. Tokenization, cost estimates, and history run in your browser.",
            },
          },
          {
            "@type": "Question",
            name: "How accurate are token counts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "OpenAI-family models use gpt-tokenizer in the browser. Other providers use labeled estimates.",
            },
          },
          {
            "@type": "Question",
            name: "Can I compare costs across models?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The sidebar ranks the same prompt across all supported models.",
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

        <section className="wx-learn">
          <h2>How the counter works</h2>
          <p className="lede">Three steps from raw text to a planning cost estimate.</p>
          <div className="wx-steps">
            <article>
              <h3>1. Paste your prompt</h3>
              <p>Single prompt or conversation. Variables like {"{{name}}"} resolve before counting.</p>
            </article>
            <article>
              <h3>2. Pick your model</h3>
              <p>
                {PRICE_MODELS.length} models · {PROVIDERS.length} providers. Exact browser counts for
                GPT-family; estimates elsewhere.
              </p>
            </article>
            <article>
              <h3>3. Read the weight</h3>
              <p>Tokens, dollars, and fill update live. Optimize, compare, then export.</p>
            </article>
          </div>
        </section>

        <section className="wx-learn">
          <div className="wx-learn-head">
            <h2>Learn how AI costs really work</h2>
            <Link href="/guides">All guides →</Link>
          </div>
          <div className="guide-list">
            {guides.slice(0, 3).map((guide) => (
              <article key={guide.slug} className="guide-card">
                <p className="guide-meta">{guide.readingMinutes} min</p>
                <h2>
                  <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                </h2>
                <p>{guide.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wx-learn">
          <h2>FAQ</h2>
          <div className="faq-list">
            <details>
              <summary>Is Fluxkit free?</summary>
              <p>Yes. No signup, no API key for counting and planning estimates.</p>
            </details>
            <details>
              <summary>Do you store prompts on a server?</summary>
              <p>No. Work stays in the browser. Share links use the URL hash only.</p>
            </details>
            <details>
              <summary>Where do prices come from?</summary>
              <p>
                Planning defaults. Confirm live rates on vendor pages — see{" "}
                <Link href="/compare">model compare</Link>.
              </p>
            </details>
          </div>
        </section>
      </div>
    </>
  );
}

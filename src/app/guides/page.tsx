import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "AI Guides — Tokens, Cost & Prompt Workflows",
  description:
    "Practical guides on ChatGPT tokens, private counting, DeepSeek vs GPT cost, prompt optimizers, and context windows — for Fluxkit’s private weigh workspace.",
  alternates: { canonical: absoluteUrl("/guides") },
  openGraph: {
    title: `AI Guides | ${siteConfig.name}`,
    description: "Long-tail guides that funnel into the Fluxkit token counter.",
    url: absoluteUrl("/guides"),
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="shell portal-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Learn</p>
          <h1>AI guides for builders</h1>
          <p className="lede">
            Long-tail explainers on tokens, cost, privacy, and prompt budgets — each one leads back
            into Fluxkit’s weigh workspace.
          </p>
        </div>
        <Link href="/" className="btn btn-primary">
          Open counter
        </Link>
      </header>

      <div className="guide-list">
        {guides.map((guide) => (
          <article key={guide.slug} className="guide-card">
            <p className="guide-meta">
              {guide.readingMinutes} min read · Updated {guide.updated}
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
    </div>
  );
}

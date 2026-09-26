import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "AI Guides — Tokens, Cost & Prompt Workflows",
  description:
    "Practical guides on ChatGPT tokens, GPT vs Claude counts, and estimating OpenAI/Claude API cost — written for builders using Fluxkit AI Lab.",
  alternates: { canonical: absoluteUrl("/guides") },
  openGraph: {
    title: `AI Guides | ${siteConfig.name}`,
    description: "SEO guides that explain the AI Lab workflow behind Fluxkit.",
    url: absoluteUrl("/guides"),
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="shell portal-page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Learn</p>
          <h1>AI guides for traffic that converts</h1>
          <p className="lede">
            Long-tail explainers that funnel into Fluxkit’s differentiated AI Lab — not generic
            “another counter” pages.
          </p>
        </div>
        <Link href="/ai" className="btn btn-primary">
          Open AI Lab
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

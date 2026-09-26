import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "AI Guides — Tokens, Cost & Prompt Workflows",
  description:
    "Practical guides on ChatGPT tokens, private counting, GPT vs Claude, prompt budgets, and cutting OpenAI/Claude API cost — written for builders using Fluxkit AI Lab.",
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
          <h1>AI guides for builders</h1>
          <p className="lede">
            Long-tail explainers on tokens, cost, privacy, and prompt budgets — each one leads into
            Fluxkit’s differentiated AI Lab workflow.
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

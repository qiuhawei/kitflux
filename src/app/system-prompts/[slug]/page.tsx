import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Chip, TechniqueChip } from "@/components/Chip";
import { countTokens, estimateCost, PRICE_MODELS } from "@/lib/aiLab";
import {
  SYSTEM_PROMPTS,
  detectTechniques,
  getSystemPrompt,
  weighHref,
} from "@/lib/systemPrompts";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const weighModel = PRICE_MODELS.find((m) => m.id === "gpt-5.4") ?? PRICE_MODELS[0];

export function generateStaticParams() {
  return SYSTEM_PROMPTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getSystemPrompt(slug);
  if (!entry) return {};
  const url = absoluteUrl(`/system-prompts/${entry.slug}`);
  return {
    title: `${entry.name} system prompt — tokens & techniques`,
    description: entry.blurb,
    alternates: { canonical: url },
    openGraph: {
      title: `${entry.name} system prompt`,
      description: entry.blurb,
      url,
      siteName: siteConfig.name,
    },
  };
}

export default async function SystemPromptDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getSystemPrompt(slug);
  if (!entry) notFound();

  const counted = countTokens(entry.prompt, weighModel);
  const cost = estimateCost({
    model: weighModel,
    inputTokens: counted.tokens,
    outputTokens: 0,
  });
  const fillPct = (counted.tokens / weighModel.contextWindow) * 100;
  const techniques = detectTechniques(entry.prompt);
  const hits = techniques.filter((t) => t.hit).length;
  const openHref = weighHref(entry.prompt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${entry.name} system prompt`,
    description: entry.blurb,
    url: absoluteUrl(`/system-prompts/${entry.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="shell portal-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/system-prompts">System Prompts</Link>
          <span>/</span>
          <span>{entry.name}</span>
        </nav>

        <header>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Chip tone="neutral">{entry.version}</Chip>
            <Chip tone={entry.confirmed ? "success" : "violet"}>
              {entry.confirmed ? "Confirmed" : "Educational reconstruction"}
            </Chip>
          </div>
          <h1 style={{ margin: "0.45rem 0 0.4rem" }}>{entry.name} system prompt</h1>
          <p className="lede">{entry.blurb}</p>
          <p className="wx-muted" style={{ marginTop: "0.35rem" }}>
            {entry.sourceNote}
          </p>
        </header>

        <div className="btn-row">
          <Link href={openHref} className="btn btn-primary">
            Open in Token Counter
          </Link>
          <Link href="/system-prompts" className="btn btn-ghost">
            Back to directory
          </Link>
          <Link href="/system-prompts/compare" className="btn btn-ghost">
            Compare prompts
          </Link>
        </div>

        <div className="detail-grid">
          <section className="detail-panel">
            <h2>Token &amp; cost analysis</h2>
            <div className="catalog-stat is-green">{counted.tokens.toLocaleString()}</div>
            <p className="wx-muted" style={{ margin: "0.25rem 0 0.75rem" }}>
              input tokens · {weighModel.label}
              {counted.exact ? " · exact" : " · estimate"}
            </p>
            <div style={{ marginBottom: "0.75rem" }}>
              <div className="wx-bar-label">
                <span>Context fill</span>
                <span>{fillPct.toFixed(1)}% of {weighModel.contextWindow.toLocaleString()}</span>
              </div>
              <div className="wx-bar-track">
                <span style={{ width: `${Math.min(100, fillPct)}%` }} />
              </div>
            </div>
            <p style={{ margin: "0 0 0.75rem" }}>
              <strong className="is-blue">${cost.inputCost.toFixed(6)}</strong>
              <span className="wx-muted"> input-only at planning rates</span>
            </p>
            <div className="catalog-meta">
              <div>
                <span>Chars</span>
                <strong>{counted.characters.toLocaleString()}</strong>
              </div>
              <div>
                <span>Words</span>
                <strong>{counted.words.toLocaleString()}</strong>
              </div>
              <div>
                <span>Lines</span>
                <strong>{entry.prompt.split("\n").length}</strong>
              </div>
              <div>
                <span>Techniques</span>
                <strong>
                  {hits}/{techniques.length}
                </strong>
              </div>
            </div>
          </section>

          <section className="detail-panel">
            <h2>Techniques detected</h2>
            <div className="tech-grid">
              {techniques.map((tech) => (
                <TechniqueChip key={tech.id} label={tech.label} hit={tech.hit} />
              ))}
            </div>
          </section>
        </div>

        <AdSlot format="horizontal" />

        <section className="wx-learn">
          <h2>Prompt text</h2>
          <pre className="prompt-pre">{entry.prompt}</pre>
        </section>

        <div className="catalog-tags" style={{ marginBottom: "1.5rem" }}>
          {entry.categories.map((c) => (
            <Chip key={c} tone="neutral">
              {c}
            </Chip>
          ))}
        </div>
      </article>
    </>
  );
}

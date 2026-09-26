import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Chip } from "@/components/Chip";
import { MigrationSnippets } from "@/components/MigrationSnippets";
import {
  DEPRECATIONS,
  enrichDeprecation,
  getDeprecation,
} from "@/lib/deprecations";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEPRECATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDeprecation(slug);
  if (!entry) return {};
  const url = absoluteUrl(`/deprecations/${entry.slug}`);
  return {
    title: `${entry.modelId} deprecation — replace with ${entry.replacement}`,
    description: `${entry.modelId} shuts down ${entry.shutdown}. Migration complexity: ${entry.complexity}. Replace with ${entry.replacement}.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${entry.modelId} deprecation`,
      description: entry.notes,
      url,
      siteName: siteConfig.name,
    },
  };
}

export default async function DeprecationDetailPage({ params }: Props) {
  const { slug } = await params;
  const raw = getDeprecation(slug);
  if (!raw) notFound();
  const entry = enrichDeprecation(raw);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${entry.modelId} deprecation`,
    description: entry.notes,
    dateModified: entry.shutdown,
    url: absoluteUrl(`/deprecations/${entry.slug}`),
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
          <Link href="/deprecations">Deprecations</Link>
          <span>/</span>
          <span>{entry.modelId}</span>
        </nav>

        <header className="page-head">
          <div>
            <div className="btn-row" style={{ marginTop: 0 }}>
              <Chip tone="neutral">{entry.provider}</Chip>
              <Chip
                tone={
                  entry.urgency === "urgent"
                    ? "urgent"
                    : entry.urgency === "soon"
                      ? "soon"
                      : entry.urgency === "retired"
                        ? "retired"
                        : "upcoming"
                }
              >
                {entry.urgency}
              </Chip>
              <Chip tone={entry.complexity}>{entry.complexity}</Chip>
              {entry.urgency !== "retired" ? (
                <Chip tone="outline">{entry.daysLeft} days left</Chip>
              ) : null}
            </div>
            <h1 style={{ marginTop: "0.55rem" }}>{entry.modelId}</h1>
            <p className="lede">{entry.notes}</p>
          </div>
        </header>

        <div className="detail-panel">
          <div className="catalog-meta" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div>
              <span>Deprecated</span>
              <strong>{entry.urgency === "retired" ? "Yes" : "Scheduled"}</strong>
            </div>
            <div>
              <span>Shutdown</span>
              <strong>{entry.shutdown}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong style={{ textTransform: "capitalize" }}>{entry.urgency}</strong>
            </div>
            <div>
              <span>Replacement</span>
              <strong style={{ fontSize: "0.86rem" }}>{entry.replacement}</strong>
            </div>
          </div>
        </div>

        {entry.urgency !== "retired" ? (
          <div className="alert-box">
            <strong>Action required</strong>
            Production calls using <code>{entry.modelId}</code> will fail after {entry.shutdown}.
            Update model strings and re-run integration tests before the cutoff.
          </div>
        ) : (
          <div className="alert-box">
            <strong>Already retired</strong>
            This id is past its shutdown date. Keep this page for migration archaeology only.
          </div>
        )}

        <section className="wx-learn">
          <h2>Quick fix — copy &amp; paste</h2>
          <MigrationSnippets entry={raw} />
        </section>

        <AdSlot format="horizontal" />

        <div className="btn-row">
          <Link href="/" className="btn btn-primary">
            Weigh prompts on the new model
          </Link>
          <Link href="/compare" className="btn btn-ghost">
            Compare pricing
          </Link>
          <Link href="/deprecations" className="btn btn-ghost">
            All deprecations
          </Link>
        </div>
      </article>
    </>
  );
}

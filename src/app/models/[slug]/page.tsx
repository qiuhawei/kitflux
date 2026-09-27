import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Chip } from "@/components/Chip";
import { PRICE_MODELS, estimateCost } from "@/lib/aiLab";
import {
  blendedPerMillion,
  deprecationForModel,
  formatUsd,
  modelHref,
} from "@/lib/modelDirectory";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRICE_MODELS.map((model) => ({ slug: model.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = PRICE_MODELS.find((item) => item.id === slug);
  if (!model) return {};
  const url = absoluteUrl(`/models/${model.id}`);
  const description = `${model.label} planning price: ${formatUsd(model.inputPerMillion)} input and ${formatUsd(model.outputPerMillion)} output per 1M tokens, ${model.contextWindow.toLocaleString()} context.`;
  return {
    title: `${model.label} API price and context window`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${model.label} | ${siteConfig.name}`,
      description,
      url,
    },
  };
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = PRICE_MODELS.find((item) => item.id === slug);
  if (!model) notFound();

  const sample = estimateCost({ model, inputTokens: 10_000, outputTokens: 2_000 });
  const heavy = estimateCost({ model, inputTokens: 100_000, outputTokens: 8_000 });
  const retired = deprecationForModel(model);
  const peers = PRICE_MODELS.filter(
    (item) => item.provider === model.provider && item.id !== model.id,
  ).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${model.label} API price and context`,
    url: absoluteUrl(`/models/${model.id}`),
    description: `${model.provider} ${model.label} planning rates and context window.`,
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
          <Link href="/models">Models</Link>
          <span>/</span>
          <span>{model.label}</span>
        </nav>
        <header>
          <div className="btn-row" style={{ marginTop: 0 }}>
            <Chip tone="neutral">{model.provider}</Chip>
            <Chip tone={model.exact ? "success" : "upcoming"}>
              {model.exact ? "Exact tokenizer" : "Estimated tokenizer"}
            </Chip>
          </div>
          <h1 style={{ margin: "0.45rem 0 0.4rem" }}>{model.label}</h1>
          <p className="lede">
            Planning rates for the {model.provider} API. Blended price{" "}
            {formatUsd(blendedPerMillion(model))} per 1M tokens at a 3:1 input-to-output mix.
          </p>
        </header>
        <div className="btn-row">
          <Link href="/" className="btn btn-primary">
            Weigh a prompt
          </Link>
          <Link
            href={`/models/compare?ids=${encodeURIComponent(model.id)},${encodeURIComponent(peers[0]?.id ?? model.id)}`}
            className="btn btn-ghost"
          >
            Compare
          </Link>
          <Link href="/models" className="btn btn-ghost">
            All models
          </Link>
        </div>
        <AdSlot format="horizontal" />
        <div className="detail-grid">
          <section className="detail-panel">
            <h2>Price</h2>
            <div className="catalog-stat is-green">{formatUsd(blendedPerMillion(model))}</div>
            <p className="wx-muted">blended per 1M tokens</p>
            <div className="catalog-meta" style={{ marginTop: "0.85rem" }}>
              <div>
                <span>Input</span>
                <strong>${model.inputPerMillion} / 1M</strong>
              </div>
              <div>
                <span>Output</span>
                <strong>${model.outputPerMillion} / 1M</strong>
              </div>
              <div>
                <span>10k in + 2k out</span>
                <strong>${sample.total.toFixed(4)}</strong>
              </div>
              <div>
                <span>100k in + 8k out</span>
                <strong>${heavy.total.toFixed(4)}</strong>
              </div>
            </div>
          </section>
          <section className="detail-panel">
            <h2>Context</h2>
            <div className="catalog-stat">{model.contextWindow.toLocaleString()}</div>
            <p className="wx-muted">token context window</p>
            <p style={{ marginTop: "0.85rem" }}>
              Family {model.family}. {model.exact ? "GPT-family counts use the browser tokenizer." : "Non-GPT counts on the counter are labeled estimates."}
            </p>
            {retired ? (
              <p>
                Shutdown tracker:{" "}
                <Link href={`/deprecations/${retired.slug}`}>{retired.modelId}</Link>
              </p>
            ) : null}
          </section>
        </div>
        {peers.length > 0 ? (
          <section className="wx-learn">
            <h2>More from {model.provider}</h2>
            <div className="catalog-tags">
              {peers.map((peer) => (
                <Link key={peer.id} href={modelHref(peer)}>
                  <Chip tone="neutral">{peer.label}</Chip>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}

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
  usersOfModel,
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
  const description = `${model.label} API price is $${model.inputPerMillion} input and $${model.outputPerMillion} output per 1M tokens. Context window ${model.contextWindow.toLocaleString()} tokens.`;
  return {
    title: `${model.label} API price: $${model.inputPerMillion} in / $${model.outputPerMillion} out`,
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
  ).slice(0, 6);
  const used = usersOfModel(model);

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
          <h1 style={{ margin: "0.45rem 0 0.4rem" }}>{model.label} API price</h1>
          <p className="lede">
            {model.provider} charges ${model.inputPerMillion} per 1M input tokens and $
            {model.outputPerMillion} per 1M output tokens. Context window{" "}
            {model.contextWindow.toLocaleString()} tokens. A 10k-in / 2k-out request is about $
            {sample.total.toFixed(4)}.
          </p>
        </header>
        <div className="catalog-meta model-spec">
          <div>
            <span>Input</span>
            <strong>${model.inputPerMillion} / 1M</strong>
          </div>
          <div>
            <span>Output</span>
            <strong>${model.outputPerMillion} / 1M</strong>
          </div>
          <div>
            <span>Blended</span>
            <strong>{formatUsd(blendedPerMillion(model))} / 1M</strong>
          </div>
          <div>
            <span>Context</span>
            <strong>{model.contextWindow.toLocaleString()}</strong>
          </div>
          <div>
            <span>10k + 2k</span>
            <strong>${sample.total.toFixed(4)}</strong>
          </div>
          <div>
            <span>100k + 8k</span>
            <strong>${heavy.total.toFixed(4)}</strong>
          </div>
        </div>
        <div className="btn-row">
          <Link href={`/?model=${encodeURIComponent(model.id)}`} className="btn btn-primary">
            Weigh with {model.label}
          </Link>
          <Link
            href={`/models/compare?ids=${encodeURIComponent(model.id)},${encodeURIComponent(peers[0]?.id ?? model.id)}`}
            className="btn btn-ghost"
          >
            Compare
          </Link>
          {retired ? (
            <Link href={`/deprecations/${retired.slug}`} className="btn btn-ghost">
              Shutdown date
            </Link>
          ) : null}
        </div>
        <AdSlot format="horizontal" />
        <section className="wx-learn">
          <h2>Who uses {model.label}</h2>
          <p className="lede">
            {used.exact
              ? "Catalog prompts weighed on this model."
              : "Catalog prompts in the same model family, plus coding agents from this provider."}
          </p>
          <div className="catalog-tags">
            {used.prompts.map((prompt) => (
              <Link key={prompt.slug} href={`/system-prompts/${prompt.slug}`}>
                <Chip tone="neutral">{prompt.name}</Chip>
              </Link>
            ))}
            {used.agents.map((agent) => (
              <Link key={agent.id} href="/coding-agents">
                <Chip tone="brand">{agent.name}</Chip>
              </Link>
            ))}
          </div>
        </section>
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

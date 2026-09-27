import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { estimateCost } from "@/lib/aiLab";
import { blendedPerMillion, formatUsd, modelHref, modelsByIds } from "@/lib/modelDirectory";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare AI Models Side by Side",
  description:
    "Compare up to four language models on blended price, input and output rates, context window, and a sample request cost.",
  alternates: { canonical: absoluteUrl("/models/compare") },
  openGraph: {
    title: `Compare AI Models | ${siteConfig.name}`,
    url: absoluteUrl("/models/compare"),
  },
};

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function ModelComparePage({ searchParams }: Props) {
  const { ids } = await searchParams;
  const selected = modelsByIds(
    (ids ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 4),
  );

  return (
    <div className="shell portal-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/models">Models</Link>
        <span>/</span>
        <span>Compare</span>
      </nav>
      <header className="page-head">
        <div>
          <p className="eyebrow">Models</p>
          <h1>Side-by-side</h1>
          <p className="lede">
            Planning price and context for the models you picked. Sample cost uses 10,000 input
            tokens and 2,000 output tokens.
          </p>
        </div>
        <Link href="/models" className="btn btn-ghost">
          Back to directory
        </Link>
      </header>
      <AdSlot format="horizontal" />
      {selected.length < 2 ? (
        <p className="lede">
          Select at least two models on the <Link href="/models">directory</Link>.
        </p>
      ) : (
        <div className="model-table-wrap">
          <table className="model-table">
            <thead>
              <tr>
                <th>Metric</th>
                {selected.map((model) => (
                  <th key={model.id}>
                    <Link href={modelHref(model)}>{model.label}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Provider</td>
                {selected.map((model) => (
                  <td key={model.id}>{model.provider}</td>
                ))}
              </tr>
              <tr>
                <td>Blended $/1M</td>
                {selected.map((model) => (
                  <td key={model.id}>{formatUsd(blendedPerMillion(model))}</td>
                ))}
              </tr>
              <tr>
                <td>Input $/1M</td>
                {selected.map((model) => (
                  <td key={model.id}>${model.inputPerMillion}</td>
                ))}
              </tr>
              <tr>
                <td>Output $/1M</td>
                {selected.map((model) => (
                  <td key={model.id}>${model.outputPerMillion}</td>
                ))}
              </tr>
              <tr>
                <td>Context</td>
                {selected.map((model) => (
                  <td key={model.id}>{model.contextWindow.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td>Sample request</td>
                {selected.map((model) => {
                  const cost = estimateCost({
                    model,
                    inputTokens: 10_000,
                    outputTokens: 2_000,
                  });
                  return <td key={model.id}>${cost.total.toFixed(4)}</td>;
                })}
              </tr>
              <tr>
                <td>Tokenizer</td>
                {selected.map((model) => (
                  <td key={model.id}>{model.exact ? "Exact in browser" : "Estimate"}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

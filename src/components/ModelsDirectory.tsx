"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PRICE_MODELS, PROVIDERS } from "@/lib/aiLab";
import { blendedPerMillion, formatUsd, modelHref } from "@/lib/modelDirectory";

type SortKey = "price" | "input" | "output" | "context" | "name";

export function ModelsDirectory() {
  const [provider, setProvider] = useState("all");
  const [sort, setSort] = useState<SortKey>("price");
  const [picked, setPicked] = useState<string[]>([]);

  const rows = useMemo(() => {
    const list = PRICE_MODELS.filter(
      (model) => provider === "all" || model.provider === provider,
    );
    return [...list].sort((a, b) => {
      if (sort === "name") return a.label.localeCompare(b.label);
      if (sort === "input") return a.inputPerMillion - b.inputPerMillion;
      if (sort === "output") return a.outputPerMillion - b.outputPerMillion;
      if (sort === "context") return b.contextWindow - a.contextWindow;
      return blendedPerMillion(a) - blendedPerMillion(b);
    });
  }, [provider, sort]);

  function toggle(id: string) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  }

  const compareHref =
    picked.length >= 2 ? `/models/compare?ids=${picked.map(encodeURIComponent).join(",")}` : "";

  return (
    <>
      <div className="filter-row" role="tablist" aria-label="Providers">
        <button
          type="button"
          className={provider === "all" ? "filter-pill filter-pill-active" : "filter-pill"}
          onClick={() => setProvider("all")}
        >
          All
        </button>
        {PROVIDERS.map((name) => (
          <button
            key={name}
            type="button"
            className={provider === name ? "filter-pill filter-pill-active" : "filter-pill"}
            onClick={() => setProvider(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="wx-learn-head" style={{ margin: "0.85rem 0" }}>
        <div className="filter-row" role="tablist" aria-label="Sort">
          {(
            [
              ["price", "Blended price"],
              ["input", "Input price"],
              ["output", "Output price"],
              ["context", "Context"],
              ["name", "Name"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={sort === key ? "filter-pill filter-pill-active" : "filter-pill"}
              onClick={() => setSort(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {compareHref ? (
          <Link href={compareHref} className="btn btn-primary">
            Compare {picked.length}
          </Link>
        ) : (
          <span className="wx-muted">Pick 2–4 models to compare</span>
        )}
      </div>

      <div className="model-table-wrap">
        <table className="model-table">
          <thead>
            <tr>
              <th />
              <th>Model</th>
              <th>Provider</th>
              <th>Blended $/1M</th>
              <th>Input $/1M</th>
              <th>Output $/1M</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((model) => (
              <tr key={model.id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Compare ${model.label}`}
                    checked={picked.includes(model.id)}
                    onChange={() => toggle(model.id)}
                  />
                </td>
                <td>
                  <Link href={modelHref(model)}>
                    <strong>{model.label}</strong>
                  </Link>
                  <span className="model-family">{model.family}</span>
                </td>
                <td>{model.provider}</td>
                <td>{formatUsd(blendedPerMillion(model))}</td>
                <td>${model.inputPerMillion}</td>
                <td>${model.outputPerMillion}</td>
                <td>{model.contextWindow.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="wx-muted" style={{ marginTop: "0.75rem" }}>
        Blended price assumes 3 input tokens for every 1 output token. Planning defaults — confirm
        on the vendor page before you budget.
      </p>
    </>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PRICE_MODELS, type ModelFamily } from "@/lib/aiLab";
import {
  MODEL_SERIES,
  blendedPerMillion,
  formatContext,
  formatUsd,
  modelBlurb,
  modelHref,
} from "@/lib/modelDirectory";

type SortKey = "input" | "output" | "context" | "name";
type ContextBand = "any" | "128" | "400" | "1000";

export function ModelsDirectory() {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<ModelFamily[]>([]);
  const [contextBand, setContextBand] = useState<ContextBand>("any");
  const [maxInput, setMaxInput] = useState("any");
  const [sort, setSort] = useState<SortKey>("input");
  const [picked, setPicked] = useState<string[]>([]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = PRICE_MODELS.filter((model) => {
      if (series.length > 0 && !series.includes(model.family)) return false;
      if (contextBand === "128" && model.contextWindow < 128_000) return false;
      if (contextBand === "400" && model.contextWindow < 400_000) return false;
      if (contextBand === "1000" && model.contextWindow < 1_000_000) return false;
      if (maxInput === "0.5" && model.inputPerMillion > 0.5) return false;
      if (maxInput === "2" && model.inputPerMillion > 2) return false;
      if (maxInput === "10" && model.inputPerMillion > 10) return false;
      if (!q) return true;
      return (
        model.label.toLowerCase().includes(q) ||
        model.provider.toLowerCase().includes(q) ||
        model.family.includes(q)
      );
    });
    return [...list].sort((a, b) => {
      if (sort === "name") return a.label.localeCompare(b.label);
      if (sort === "output") return a.outputPerMillion - b.outputPerMillion;
      if (sort === "context") return b.contextWindow - a.contextWindow;
      return a.inputPerMillion - b.inputPerMillion;
    });
  }, [query, series, contextBand, maxInput, sort]);

  function toggleSeries(id: ModelFamily) {
    setSeries((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function togglePick(id: string) {
    setPicked((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  }

  const compareHref =
    picked.length >= 2 ? `/models/compare?ids=${picked.map(encodeURIComponent).join(",")}` : "";

  return (
    <div className="or-layout">
      <aside className="or-side">
        <fieldset>
          <legend>Series</legend>
          {MODEL_SERIES.map((item) => (
            <label key={item.id}>
              <input
                type="checkbox"
                checked={series.includes(item.id)}
                onChange={() => toggleSeries(item.id)}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <label className="or-field">
          Context length
          <select value={contextBand} onChange={(event) => setContextBand(event.target.value as ContextBand)}>
            <option value="any">Any</option>
            <option value="128">128k and up</option>
            <option value="400">400k and up</option>
            <option value="1000">1M and up</option>
          </select>
        </label>
        <label className="or-field">
          Prompt pricing
          <select value={maxInput} onChange={(event) => setMaxInput(event.target.value)}>
            <option value="any">Any input price</option>
            <option value="0.5">Input under $0.50 / 1M</option>
            <option value="2">Input under $2 / 1M</option>
            <option value="10">Input under $10 / 1M</option>
          </select>
        </label>
        <p className="wx-muted">Text in, text out. Prices are planning rates.</p>
      </aside>

      <div className="or-main">
        <div className="or-toolbar">
          <input
            className="search-bar"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search models"
            aria-label="Search models"
          />
          <label className="or-field or-field-inline">
            Sort
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
              <option value="input">Lowest input price</option>
              <option value="output">Lowest output price</option>
              <option value="context">Largest context</option>
              <option value="name">Name</option>
            </select>
          </label>
          {compareHref ? (
            <Link href={compareHref} className="btn btn-primary">
              Compare {picked.length}
            </Link>
          ) : (
            <span className="wx-muted">Select 2–4 to compare</span>
          )}
        </div>
        <p className="wx-muted">{rows.length} models</p>
        <ul className="or-list">
          {rows.map((model) => (
            <li key={model.id} className="or-row">
              <input
                type="checkbox"
                aria-label={`Compare ${model.label}`}
                checked={picked.includes(model.id)}
                onChange={() => togglePick(model.id)}
              />
              <div>
                <Link href={modelHref(model)}>
                  <strong>
                    {model.provider}: {model.label}
                  </strong>
                </Link>
                <p>{modelBlurb(model)}</p>
                <p className="or-meta">
                  by {model.provider}
                  <span>{formatContext(model.contextWindow)}</span>
                  <span>${model.inputPerMillion}/M input tokens</span>
                  <span>${model.outputPerMillion}/M output tokens</span>
                  <span>blended {formatUsd(blendedPerMillion(model))}/M</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

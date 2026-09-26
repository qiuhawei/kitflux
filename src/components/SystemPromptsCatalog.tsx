"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip } from "@/components/Chip";
import {
  PROMPT_CATEGORIES,
  SYSTEM_PROMPTS,
  detectTechniques,
  type PromptCategory,
} from "@/lib/systemPrompts";
import { countTokens, PRICE_MODELS } from "@/lib/aiLab";

const weighModel = PRICE_MODELS.find((m) => m.id === "gpt-5.4") ?? PRICE_MODELS[0];

export function SystemPromptsCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | PromptCategory>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SYSTEM_PROMPTS.filter((item) => {
      const catOk = category === "all" || item.categories.includes(category);
      if (!catOk) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.blurb.toLowerCase().includes(q) ||
        item.categories.some((c) => c.includes(q))
      );
    });
  }, [query, category]);

  return (
    <>
      <div className="wx-learn-head" style={{ marginBottom: "0.75rem" }}>
        <input
          className="search-bar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, categories, techniques…"
          aria-label="Search system prompts"
        />
      </div>

      <div className="filter-row" role="tablist" aria-label="Categories">
        {PROMPT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={category === cat.id ? "filter-pill filter-pill-active" : "filter-pill"}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="wx-muted" style={{ marginBottom: "0.85rem" }}>
        Showing {filtered.length} of {SYSTEM_PROMPTS.length} catalog prompts
        {" · "}
        <Link href="/system-prompts/compare" className="wx-linkish">
          Compare two →
        </Link>
      </p>

      <div className="catalog-grid">
        {filtered.map((item) => {
          const tokens = countTokens(item.prompt, weighModel).tokens;
          const techniques = detectTechniques(item.prompt);
          const hits = techniques.filter((t) => t.hit).length;
          return (
            <Link key={item.slug} href={`/system-prompts/${item.slug}`} className="catalog-card">
              <div className="catalog-card-head">
                <div>
                  <Chip tone="neutral">{item.version}</Chip>
                  <h2 style={{ marginTop: "0.45rem" }}>{item.name}</h2>
                </div>
                <Chip tone={item.confirmed ? "success" : "violet"}>
                  {item.confirmed ? "Confirmed" : "Educational"}
                </Chip>
              </div>
              <p className="wx-muted" style={{ margin: 0, fontSize: "0.86rem" }}>
                {item.blurb}
              </p>
              <div>
                <div className="catalog-stat">~{tokens.toLocaleString()}</div>
                <span className="wx-muted" style={{ fontSize: "0.75rem" }}>
                  tokens · {item.weighModelLabel}
                </span>
              </div>
              <p className="wx-muted" style={{ margin: 0, fontSize: "0.78rem" }}>
                {hits}/{techniques.length} techniques detected
              </p>
              <div className="catalog-tags">
                {item.categories.map((c) => (
                  <Chip key={c} tone="neutral">
                    {c}
                  </Chip>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

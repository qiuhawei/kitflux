"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip, TechniqueChip } from "@/components/Chip";
import { countTokens, PRICE_MODELS } from "@/lib/aiLab";
import { SYSTEM_PROMPTS, detectTechniques } from "@/lib/systemPrompts";

const weighModel = PRICE_MODELS.find((m) => m.id === "gpt-5.4") ?? PRICE_MODELS[0];

export function SystemPromptCompare() {
  const [left, setLeft] = useState(SYSTEM_PROMPTS[0]?.slug ?? "");
  const [right, setRight] = useState(SYSTEM_PROMPTS[1]?.slug ?? "");

  const a = SYSTEM_PROMPTS.find((p) => p.slug === left);
  const b = SYSTEM_PROMPTS.find((p) => p.slug === right);

  const stats = useMemo(() => {
    if (!a || !b) return null;
    const ta = countTokens(a.prompt, weighModel);
    const tb = countTokens(b.prompt, weighModel);
    const techA = detectTechniques(a.prompt);
    const techB = detectTechniques(b.prompt);
    return { ta, tb, techA, techB, delta: ta.tokens - tb.tokens };
  }, [a, b]);

  return (
    <div>
      <div className="detail-grid" style={{ marginBottom: "1rem" }}>
        <label className="detail-panel">
          <span className="wx-muted">Prompt A</span>
          <select
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.45rem",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--bg-input)",
              padding: "0.55rem 0.65rem",
            }}
          >
            {SYSTEM_PROMPTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="detail-panel">
          <span className="wx-muted">Prompt B</span>
          <select
            value={right}
            onChange={(e) => setRight(e.target.value)}
            style={{
              width: "100%",
              marginTop: "0.45rem",
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--bg-input)",
              padding: "0.55rem 0.65rem",
            }}
          >
            {SYSTEM_PROMPTS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {a && b && stats ? (
        <>
          <div className="detail-grid">
            <section className="detail-panel">
              <h2>
                <Link href={`/system-prompts/${a.slug}`}>{a.name}</Link>
              </h2>
              <div className="catalog-stat is-green">{stats.ta.tokens.toLocaleString()}</div>
              <p className="wx-muted">tokens · {a.weighModelLabel}</p>
              <div className="tech-grid" style={{ marginTop: "0.75rem" }}>
                {stats.techA.map((t) => (
                  <TechniqueChip key={t.id} label={t.label} hit={t.hit} />
                ))}
              </div>
            </section>
            <section className="detail-panel">
              <h2>
                <Link href={`/system-prompts/${b.slug}`}>{b.name}</Link>
              </h2>
              <div className="catalog-stat is-green">{stats.tb.tokens.toLocaleString()}</div>
              <p className="wx-muted">tokens · {b.weighModelLabel}</p>
              <div className="tech-grid" style={{ marginTop: "0.75rem" }}>
                {stats.techB.map((t) => (
                  <TechniqueChip key={t.id} label={t.label} hit={t.hit} />
                ))}
              </div>
            </section>
          </div>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Delta:{" "}
            <Chip tone={stats.delta === 0 ? "neutral" : stats.delta > 0 ? "soon" : "trivial"}>
              {stats.delta > 0 ? "+" : ""}
              {stats.delta.toLocaleString()} tokens (A − B)
            </Chip>
          </p>
        </>
      ) : null}
    </div>
  );
}

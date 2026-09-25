"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type PriceRow = {
  id: string;
  label: string;
  inputPerMillion: number;
  outputPerMillion: number;
};

/** Approximate public list prices in USD per 1M tokens — update periodically. */
const MODELS: PriceRow[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    inputPerMillion: 2.5,
    outputPerMillion: 10,
  },
  {
    id: "claude-sonnet",
    label: "Claude Sonnet (approx.)",
    inputPerMillion: 3,
    outputPerMillion: 15,
  },
];

export function AiCostCalculatorTool() {
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [inputTokens, setInputTokens] = useState(2000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [requests, setRequests] = useState(100);

  const model = MODELS.find((item) => item.id === modelId) ?? MODELS[0];

  const result = useMemo(() => {
    const inputCost = (inputTokens / 1_000_000) * model.inputPerMillion * requests;
    const outputCost = (outputTokens / 1_000_000) * model.outputPerMillion * requests;
    const total = inputCost + outputCost;
    return {
      inputCost,
      outputCost,
      total,
      perRequest: requests > 0 ? total / requests : 0,
    };
  }, [model, inputTokens, outputTokens, requests]);

  const summary = `Est. $${result.total.toFixed(4)} for ${requests} requests (${model.label})`;

  return (
    <div className="tool-panel">
      <div className="tool-actions" role="group" aria-label="Model pricing">
        {MODELS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={modelId === item.id ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => setModelId(item.id)}
            aria-pressed={modelId === item.id}
          >
            {item.label}
          </button>
        ))}
        <CopyButton value={summary} label="Copy estimate" />
      </div>
      <p className="tool-hint">
        Ballpark only — vendor prices change. Pair with the token counter for prompt size.
      </p>
      <div className="split-editors">
        <label className="field">
          <span>Input tokens / request</span>
          <input
            type="number"
            min={0}
            value={inputTokens}
            onChange={(e) => setInputTokens(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="field">
          <span>Output tokens / request</span>
          <input
            type="number"
            min={0}
            value={outputTokens}
            onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
      </div>
      <label className="field field-compact">
        <span>Requests</span>
        <input
          type="number"
          min={1}
          value={requests}
          onChange={(e) => setRequests(Math.max(1, Number(e.target.value) || 1))}
        />
      </label>
      <div className="stat-grid" aria-live="polite">
        <div>
          <strong>${result.inputCost.toFixed(4)}</strong>
          <span>Input cost</span>
        </div>
        <div>
          <strong>${result.outputCost.toFixed(4)}</strong>
          <span>Output cost</span>
        </div>
        <div>
          <strong>${result.total.toFixed(4)}</strong>
          <span>Total</span>
        </div>
        <div>
          <strong>${result.perRequest.toFixed(6)}</strong>
          <span>Per request</span>
        </div>
      </div>
    </div>
  );
}

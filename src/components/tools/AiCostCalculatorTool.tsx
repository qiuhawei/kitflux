"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { PRICE_MODELS, estimateCost } from "@/lib/aiLab";

export function AiCostCalculatorTool() {
  const [modelId, setModelId] = useState(PRICE_MODELS[0].id);
  const [inputTokens, setInputTokens] = useState(2000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [requests, setRequests] = useState(100);

  const model = PRICE_MODELS.find((item) => item.id === modelId) ?? PRICE_MODELS[0];
  const result = useMemo(
    () => estimateCost({ model, inputTokens, outputTokens, requests }),
    [model, inputTokens, outputTokens, requests],
  );

  const summary = `Est. $${result.total.toFixed(4)} for ${requests} requests (${model.label})`;

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Want prompt size to drive cost automatically? Use{" "}
        <a href="/ai">AI Lab</a> — this page is the focused calculator.
      </p>
      <div className="tool-actions" role="group" aria-label="Model pricing">
        {PRICE_MODELS.map((item) => (
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

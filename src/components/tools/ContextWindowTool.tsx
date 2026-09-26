"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  PRICE_MODELS,
  TOKEN_PRESETS,
  contextFill,
  estimateTokens,
} from "@/lib/aiLab";

const SAMPLE =
  "You are a retrieval assistant. Use only the provided chunks. Answer in JSON with keys answer and citations.";

export function ContextWindowTool() {
  const [text, setText] = useState(SAMPLE);
  const [modelId, setModelId] = useState(PRICE_MODELS[0].id);
  const [outputTokens, setOutputTokens] = useState(800);

  const model = PRICE_MODELS.find((item) => item.id === modelId) ?? PRICE_MODELS[0];
  const preset =
    TOKEN_PRESETS.find((item) => item.id === model.family) ?? TOKEN_PRESETS[0];
  const input = useMemo(
    () => estimateTokens(text, preset.charsPerToken),
    [text, preset.charsPerToken],
  );
  const fill = contextFill(input.tokens, outputTokens, model.contextWindow);

  const summary = [
    `Model: ${model.label}`,
    `Context window: ${model.contextWindow.toLocaleString()} tokens`,
    `Input ≈ ${input.tokens}`,
    `Reserved output: ${outputTokens}`,
    `Used: ${fill.used} (${fill.pct.toFixed(1)}%)`,
    `Remaining: ${fill.remaining}`,
    `Status: ${fill.status}`,
  ].join("\n");

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        See how much of a model’s context window your prompt + reply will eat. Pair with{" "}
        <a href="/ai">AI Lab</a> or read{" "}
        <a href="/guides/context-window-calculator">the context window guide</a>.
      </p>

      <div className="chip-row" role="group" aria-label="Model">
        {PRICE_MODELS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={modelId === item.id ? "chip chip-active" : "chip"}
            onClick={() => setModelId(item.id)}
            aria-pressed={modelId === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="stat-grid" aria-live="polite">
        <div>
          <strong>{input.tokens}</strong>
          <span>Input tokens</span>
        </div>
        <div>
          <strong>{fill.used}</strong>
          <span>Used (in+out)</span>
        </div>
        <div>
          <strong>{fill.pct.toFixed(1)}%</strong>
          <span>Window filled</span>
        </div>
        <div>
          <strong>{fill.remaining.toLocaleString()}</strong>
          <span>Remaining</span>
        </div>
      </div>

      <div
        className={`context-meter context-meter-${fill.status}`}
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, Math.round(fill.pct))}
        aria-label="Context window fill"
      >
        <span style={{ width: `${Math.min(100, fill.pct)}%` }} />
      </div>
      <p className="field-note">
        {model.label} window ≈ {model.contextWindow.toLocaleString()} tokens · status:{" "}
        {fill.status}
      </p>

      <label className="field field-compact">
        <span>Reserved output tokens</span>
        <input
          type="number"
          min={0}
          value={outputTokens}
          onChange={(e) => setOutputTokens(Math.max(0, Number(e.target.value) || 0))}
        />
      </label>

      <label className="field">
        <span>Prompt / context payload</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          spellCheck={false}
          placeholder="Paste system prompt + RAG chunks + history…"
        />
      </label>

      <div className="tool-actions">
        <CopyButton value={summary} label="Copy fill summary" />
      </div>
    </div>
  );
}

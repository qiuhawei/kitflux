"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { compareCostsAcrossModels } from "@/lib/aiLab";

const SAMPLE = `Role: You are a concise analyst.
Task: Summarize the tradeoffs of routing easy traffic to a cheaper model.
Constraints: Bullets only. No marketing fluff.
Output format: 5 bullets max.`;

export function ModelPricingTool() {
  const [text, setText] = useState(SAMPLE);
  const [outputRatio, setOutputRatio] = useState(0.4);
  const [requests, setRequests] = useState(1000);

  const rows = useMemo(
    () => compareCostsAcrossModels({ text, outputRatio, requests }),
    [text, outputRatio, requests],
  );
  const cheapest = rows[0];

  const tableText = rows
    .map(
      (row) =>
        `${row.model.label}\t$${row.cost.total.toFixed(4)}\t${row.inputTokens}\t${row.fill.pct.toFixed(1)}%`,
    )
    .join("\n");

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Same prompt priced across GPT, Claude, Gemini, DeepSeek, Grok, and Mistral — planning
        defaults only. Deep dive:{" "}
        <a href="/guides/deepseek-vs-gpt-api-cost">DeepSeek vs GPT cost</a>.
      </p>

      <div className="stat-grid" aria-live="polite">
        <div>
          <strong>{cheapest?.model.label ?? "—"}</strong>
          <span>Cheapest on this draft</span>
        </div>
        <div>
          <strong>${cheapest?.cost.total.toFixed(4) ?? "—"}</strong>
          <span>Est. for {requests} req</span>
        </div>
        <div>
          <strong>{cheapest?.inputTokens ?? "—"}</strong>
          <span>Input tokens (family)</span>
        </div>
        <div>
          <strong>{Math.round(outputRatio * 100)}%</strong>
          <span>Output vs input</span>
        </div>
      </div>

      <div className="split-editors">
        <label className="field">
          <span>Output size vs input</span>
          <input
            type="range"
            min={0.1}
            max={2}
            step={0.05}
            value={outputRatio}
            onChange={(e) => setOutputRatio(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Requests</span>
          <input
            type="number"
            min={1}
            value={requests}
            onChange={(e) => setRequests(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
      </div>

      <div className="model-table-wrap">
        <table className="model-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>In $/1M</th>
              <th>Out $/1M</th>
              <th>Est. total</th>
              <th>Context fill</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.model.id}>
                <td>
                  <strong>{row.model.label}</strong>
                  <span className="model-family">{row.model.family}</span>
                </td>
                <td>${row.model.inputPerMillion}</td>
                <td>${row.model.outputPerMillion}</td>
                <td>${row.cost.total.toFixed(4)}</td>
                <td>{row.fill.pct.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label className="field">
        <span>Prompt used for comparison</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          spellCheck={false}
        />
      </label>

      <div className="tool-actions">
        <CopyButton value={tableText} label="Copy table" />
        <a className="btn btn-secondary" href="/ai">
          Open AI Lab
        </a>
      </div>
    </div>
  );
}

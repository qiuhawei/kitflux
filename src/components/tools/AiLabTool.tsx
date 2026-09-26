"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import {
  PRICE_MODELS,
  PROMPT_TEMPLATES,
  clearLabHistory,
  compareTokens,
  estimateCost,
  loadLabHistory,
  saveLabHistory,
  buildPrompt,
  labShareUrl,
  readLabShareHash,
  type LabHistoryItem,
} from "@/lib/aiLab";

const SAMPLE = `Role: You are a senior engineer.
Task: Review this API design for rate limiting.
Topic / input: Public REST API with free and paid tiers.
Constraints: Prefer simple headers, document abuse cases.
Output format: Bullets, then a short JSON example.`;

export function AiLabTool() {
  const [text, setText] = useState(SAMPLE);
  const [templateId, setTemplateId] = useState(PROMPT_TEMPLATES[0].id);
  const [topic, setTopic] = useState("Public REST API with free and paid tiers");
  const [extra, setExtra] = useState("Prefer simple headers, document abuse cases.");
  const [modelId, setModelId] = useState(PRICE_MODELS[0].id);
  const [outputRatio, setOutputRatio] = useState(0.35);
  const [requests, setRequests] = useState(100);
  const [history, setHistory] = useState<LabHistoryItem[]>([]);
  const [shareInfo, setShareInfo] = useState("");

  useEffect(() => {
    setHistory(loadLabHistory());
    const shared = readLabShareHash();
    if (shared && shared.trim()) {
      setText(shared);
      setShareInfo("Loaded prompt from share link.");
    }
  }, []);

  const template = PROMPT_TEMPLATES.find((item) => item.id === templateId) ?? PROMPT_TEMPLATES[0];
  const model = PRICE_MODELS.find((item) => item.id === modelId) ?? PRICE_MODELS[0];
  const comparisons = useMemo(() => compareTokens(text), [text]);
  const primaryTokens =
    comparisons.find((item) => item.id === model.family)?.tokens ?? comparisons[0]?.tokens ?? 0;
  const outputTokens = Math.max(0, Math.round(primaryTokens * outputRatio));
  const cost = useMemo(
    () =>
      estimateCost({
        model,
        inputTokens: primaryTokens,
        outputTokens,
        requests,
      }),
    [model, primaryTokens, outputTokens, requests],
  );

  function applyTemplate() {
    setText(buildPrompt(template, topic, extra));
  }

  function persist() {
    setHistory(saveLabHistory(text, history));
    setShareInfo("Saved on this device.");
  }

  function copyShareLink() {
    if (text.length > 6000) {
      setShareInfo("Prompt too long for a URL — save locally or shorten it.");
      return;
    }
    const url = labShareUrl(text);
    void navigator.clipboard.writeText(url).then(
      () => {
        window.location.hash = url.slice(url.indexOf("#"));
        setShareInfo("Share link copied — opens the same draft in the browser, no upload.");
      },
      () => setShareInfo("Could not copy — copy from the address bar after saving."),
    );
  }

  const summary = [
    `Fluxkit AI Lab`,
    `Input ≈ ${primaryTokens} tokens (${model.family.toUpperCase()} family)`,
    `Output ≈ ${outputTokens} tokens (ratio ${outputRatio})`,
    `Model: ${model.label}`,
    `Requests: ${requests}`,
    `Est. total: $${cost.total.toFixed(4)} ($${cost.perRequest.toFixed(6)} / req)`,
    `Privacy: calculated locally — prompt not uploaded`,
  ].join("\n");

  return (
    <div className="lab-shell">
      <div className="lab-privacy" role="status">
        <strong>Private AI Lab</strong>
        <span>One paste → tokens across models + cost. Everything stays in this browser.</span>
      </div>

      <div className="lab-grid">
        <section className="lab-main tool-panel">
          <div className="lab-section-head">
            <h2>1. Draft the prompt</h2>
            <p>Build from a template or paste your own.</p>
          </div>

          <div className="chip-row" role="group" aria-label="Prompt templates">
            {PROMPT_TEMPLATES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={templateId === item.id ? "chip chip-active" : "chip"}
                onClick={() => setTemplateId(item.id)}
                aria-pressed={templateId === item.id}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="split-editors">
            <label className="field">
              <span>Topic / input</span>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={3} />
            </label>
            <label className="field">
              <span>Constraints</span>
              <textarea value={extra} onChange={(e) => setExtra(e.target.value)} rows={3} />
            </label>
          </div>

          <div className="tool-actions">
            <button type="button" className="btn btn-primary" onClick={applyTemplate}>
              Apply template
            </button>
            <button type="button" className="btn btn-secondary" onClick={persist}>
              Save locally
            </button>
            <button type="button" className="btn btn-secondary" onClick={copyShareLink}>
              Copy share link
            </button>
            <CopyButton value={text} label="Copy prompt" />
          </div>
          {shareInfo ? <p className="tool-info">{shareInfo}</p> : null}

          <label className="field">
            <span>Working prompt</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              spellCheck={false}
              placeholder="Paste or build your prompt…"
            />
          </label>
        </section>

        <aside className="lab-side">
          <section className="tool-panel">
            <div className="lab-section-head">
              <h2>2. Compare tokens</h2>
              <p>Same text, three model-family estimates.</p>
            </div>
            <div className="lab-compare" aria-live="polite">
              {comparisons.map((row) => (
                <div key={row.id} className="lab-compare-card">
                  <span className="lab-compare-label">{row.short}</span>
                  <strong>{row.tokens}</strong>
                  <span>est. tokens</span>
                </div>
              ))}
            </div>
            <p className="tool-hint">
              Approximations for planning — official tokenizers can differ slightly.
            </p>
          </section>

          <section className="tool-panel">
            <div className="lab-section-head">
              <h2>3. Estimate spend</h2>
              <p>Uses the matching family token count as input size.</p>
            </div>
            <div className="chip-row" role="group" aria-label="Price model">
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
                <span className="field-note">{Math.round(outputRatio * 100)}% of input</span>
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
            <div className="stat-grid" aria-live="polite">
              <div>
                <strong>{primaryTokens}</strong>
                <span>Input tokens</span>
              </div>
              <div>
                <strong>{outputTokens}</strong>
                <span>Output tokens</span>
              </div>
              <div>
                <strong>${cost.total.toFixed(4)}</strong>
                <span>Total</span>
              </div>
              <div>
                <strong>${cost.perRequest.toFixed(6)}</strong>
                <span>Per request</span>
              </div>
            </div>
            <div className="tool-actions">
              <CopyButton value={summary} label="Copy lab summary" />
            </div>
          </section>

          <section className="tool-panel">
            <div className="lab-section-head">
              <h2>Local history</h2>
              <p>Saved only on this device.</p>
            </div>
            {history.length === 0 ? (
              <p className="tool-hint">No saves yet. Click “Save locally” after drafting.</p>
            ) : (
              <ul className="lab-history">
                {history.map((item) => (
                  <li key={item.id}>
                    <button type="button" className="lab-history-item" onClick={() => setText(item.text)}>
                      <strong>{item.preview}</strong>
                      <span>{new Date(item.savedAt).toLocaleString()}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {history.length > 0 ? (
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => {
                  clearLabHistory();
                  setHistory([]);
                }}
              >
                Clear history
              </button>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}

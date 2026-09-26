"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PRICE_MODELS,
  SAMPLE_PROMPT,
  compareCosts,
  contextFill,
  countTokens,
  encodeShareHash,
  estimateCost,
  exportSnippets,
  extractVariableKeys,
  heatmapSegments,
  loadHistory,
  loadSnippets,
  loadVersions,
  optimizePrompt,
  promptTips,
  pushHistory,
  readShareHash,
  resolveVariables,
  saveSnippet,
  saveVersion,
  shareUrl,
  turnsToText,
  type ChatTurn,
  type LabHistoryItem,
} from "@/lib/aiLab";

type Mode = "single" | "conversation";
type View = "edit" | "heatmap" | "optimize";
type ExportKind = "curl" | "python" | "node" | null;

function newTurn(role: ChatTurn["role"]): ChatTurn {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, role, content: "" };
}

export function PromptWorkspace() {
  const [mode, setMode] = useState<Mode>("single");
  const [view, setView] = useState<View>("edit");
  const [text, setText] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([
    newTurn("system"),
    { ...newTurn("user"), content: "" },
  ]);
  const [modelId, setModelId] = useState("gpt-4o");
  const [outputRatio, setOutputRatio] = useState(3);
  const [vars, setVars] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<LabHistoryItem[]>([]);
  const [versions, setVersions] = useState<LabHistoryItem[]>([]);
  const [snippets, setSnippets] = useState<LabHistoryItem[]>([]);
  const [status, setStatus] = useState("");
  const [exportKind, setExportKind] = useState<ExportKind>(null);
  const [compareMode, setCompareMode] = useState<"chart" | "table">("chart");
  const [undoText, setUndoText] = useState<string | null>(null);

  const model = PRICE_MODELS.find((m) => m.id === modelId) ?? PRICE_MODELS[0];

  useEffect(() => {
    setHistory(loadHistory());
    setVersions(loadVersions());
    setSnippets(loadSnippets());
    const shared = readShareHash();
    if (shared?.trim()) {
      setText(shared);
      setStatus("Loaded prompt from share link.");
    }
  }, []);

  const rawText = mode === "single" ? text : turnsToText(turns);
  const varKeys = useMemo(() => extractVariableKeys(rawText), [rawText]);
  const resolved = useMemo(() => resolveVariables(rawText, vars), [rawText, vars]);

  const input = useMemo(() => countTokens(resolved, model), [resolved, model]);
  const outputTokens = Math.max(0, Math.round(input.tokens * outputRatio));
  const cost = useMemo(
    () => estimateCost({ model, inputTokens: input.tokens, outputTokens }),
    [model, input.tokens, outputTokens],
  );
  const fill = contextFill(input.tokens, outputTokens, model.contextWindow);
  const rows = useMemo(() => compareCosts(resolved, outputRatio), [resolved, outputRatio]);
  const tips = useMemo(() => promptTips(resolved), [resolved]);
  const optimized = useMemo(() => optimizePrompt(resolved), [resolved]);
  const heat = useMemo(() => heatmapSegments(resolved), [resolved]);
  const exports = useMemo(() => exportSnippets(resolved, model), [resolved, model]);
  const maxBar = Math.max(...rows.map((r) => r.cost.total), 0.000001);

  function applySample() {
    setMode("single");
    setText(SAMPLE_PROMPT);
    setView("edit");
    setStatus("Sample prompt loaded.");
  }

  function applyOptimize() {
    setUndoText(resolved);
    if (mode === "single") setText(optimized.text);
    else {
      setMode("single");
      setText(optimized.text);
    }
    setView("edit");
    const saved = optimized.beforeChars - optimized.afterChars;
    setStatus(saved > 0 ? `Optimized (−${saved} chars). Undo available.` : "Already lean.");
  }

  function undoOptimize() {
    if (undoText == null) return;
    setText(undoText);
    setUndoText(null);
    setStatus("Restored previous prompt.");
  }

  function copyText(value: string, label: string) {
    void navigator.clipboard.writeText(value).then(
      () => setStatus(`${label} copied.`),
      () => setStatus("Copy failed."),
    );
  }

  function onShare() {
    if (resolved.length > 8000) {
      setStatus("Prompt too long for a URL share — save a snippet instead.");
      return;
    }
    const hash = encodeShareHash(resolved);
    const url = shareUrl(resolved);
    void navigator.clipboard.writeText(url).then(() => {
      window.location.hash = hash;
      setStatus("Share link copied — opens locally, no upload.");
    });
  }

  function onSaveVersion() {
    setVersions(saveVersion(resolved, versions));
    setStatus("Version saved on this device.");
  }

  function onSaveSnippet() {
    setSnippets(saveSnippet(resolved, snippets));
    setStatus("Snippet saved on this device.");
  }

  function remember() {
    if (!resolved.trim()) return;
    setHistory(
      pushHistory(
        {
          preview: resolved.slice(0, 72).replace(/\s+/g, " "),
          text: resolved,
          modelId: model.id,
          tokens: input.tokens,
        },
        history,
      ),
    );
  }

  useEffect(() => {
    if (!resolved.trim() || resolved.length < 40) return;
    const t = window.setTimeout(remember, 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved, model.id, input.tokens]);

  return (
    <div className="wx">
      <section className="wx-hero">
        <div className="wx-hero-copy">
          <h1>
            Every <span className="wx-em">token</span> has a <span className="wx-em">price</span>
          </h1>
          <p>
            Count tokens and estimate API cost for GPT, Claude, Gemini, Grok, DeepSeek and{" "}
            {PRICE_MODELS.length}+ models. Optimize locally — your prompt never leaves this
            browser.
          </p>
          <div className="wx-pills">
            <span>
              <strong>{PRICE_MODELS.length}</strong> models
            </span>
            <span>
              <strong>{new Set(PRICE_MODELS.map((m) => m.provider)).size}</strong> providers
            </span>
            <span>
              <strong>100%</strong> private
            </span>
          </div>
        </div>
      </section>

      <div className="wx-shell">
        <div className="wx-main">
          <div className="wx-toolbar">
            <div className="wx-seg" role="tablist" aria-label="Prompt mode">
              <button
                type="button"
                className={mode === "single" ? "active" : undefined}
                onClick={() => setMode("single")}
              >
                Single prompt
              </button>
              <button
                type="button"
                className={mode === "conversation" ? "active" : undefined}
                onClick={() => setMode("conversation")}
              >
                Conversation
              </button>
            </div>
            <div className="wx-actions">
              <button
                type="button"
                className={view === "heatmap" ? "wx-btn wx-btn-on" : "wx-btn"}
                onClick={() => setView(view === "heatmap" ? "edit" : "heatmap")}
              >
                Heatmap
              </button>
              <button
                type="button"
                className={view === "optimize" ? "wx-btn wx-btn-accent" : "wx-btn"}
                onClick={() => setView(view === "optimize" ? "edit" : "optimize")}
              >
                {view === "optimize" ? "Hide optimizer" : "Optimize"}
              </button>
              <button type="button" className="wx-btn" onClick={applySample}>
                Sample
              </button>
              <button type="button" className="wx-btn" onClick={() => copyText(resolved, "Prompt")}>
                Copy
              </button>
              <button type="button" className="wx-btn" onClick={onShare}>
                Share
              </button>
              <button
                type="button"
                className="wx-btn"
                onClick={() => setExportKind(exportKind ? null : "curl")}
              >
                Export
              </button>
            </div>
          </div>

          {view === "heatmap" ? (
            <div className="wx-heat" aria-label="Token density heatmap">
              {heat.map((seg) =>
                seg.text ? (
                  <span key={seg.key} className={`wx-heat-${seg.level}`}>
                    {seg.text}
                  </span>
                ) : null,
              )}
            </div>
          ) : mode === "single" ? (
            <textarea
              className="wx-editor"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your prompt here…"
              spellCheck={false}
              rows={14}
            />
          ) : (
            <div className="wx-turns">
              {turns.map((turn, index) => (
                <div key={turn.id} className="wx-turn">
                  <div className="wx-turn-head">
                    <select
                      value={turn.role}
                      onChange={(e) => {
                        const role = e.target.value as ChatTurn["role"];
                        setTurns((prev) =>
                          prev.map((t) => (t.id === turn.id ? { ...t, role } : t)),
                        );
                      }}
                    >
                      <option value="system">system</option>
                      <option value="user">user</option>
                      <option value="assistant">assistant</option>
                    </select>
                    <button
                      type="button"
                      className="wx-btn wx-btn-tiny"
                      onClick={() => setTurns((prev) => prev.filter((t) => t.id !== turn.id))}
                      disabled={turns.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={turn.content}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTurns((prev) =>
                        prev.map((t) => (t.id === turn.id ? { ...t, content: value } : t)),
                      );
                    }}
                    rows={index === 0 ? 4 : 5}
                    placeholder={`${turn.role} message…`}
                    spellCheck={false}
                  />
                </div>
              ))}
              <button
                type="button"
                className="wx-btn"
                onClick={() => setTurns((prev) => [...prev, newTurn("user")])}
              >
                + Add message
              </button>
            </div>
          )}

          <div className="wx-meta">
            <span>
              {input.tokens.toLocaleString()} / {model.contextWindow.toLocaleString()}
              {input.exact ? " · exact" : " · estimate"}
            </span>
            <button type="button" className="wx-linkish" onClick={applySample}>
              Try a sample prompt
            </button>
          </div>

          {view === "optimize" ? (
            <div className="wx-optimize">
              <div className="wx-optimize-head">
                <h2>Prompt tips based on your draft</h2>
                <div className="wx-actions">
                  <button type="button" className="wx-btn wx-btn-accent" onClick={applyOptimize}>
                    Apply cleanup
                  </button>
                  {undoText != null ? (
                    <button type="button" className="wx-btn" onClick={undoOptimize}>
                      Undo
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="wx-tips">
                {tips.map((tip) => (
                  <article key={tip.id}>
                    <strong>{tip.title}</strong>
                    <p>{tip.body}</p>
                  </article>
                ))}
              </div>
              {optimized.hits.length > 0 ? (
                <ul className="wx-hits">
                  {optimized.hits.map((hit) => (
                    <li key={hit.id}>
                      <strong>{hit.label}</strong>
                      <span>
                        {hit.detail} (−{hit.savedChars})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {exportKind ? (
            <div className="wx-export">
              <div className="wx-seg">
                {(["curl", "python", "node"] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    className={exportKind === kind ? "active" : undefined}
                    onClick={() => setExportKind(kind)}
                  >
                    {kind}
                  </button>
                ))}
              </div>
              <pre>{exports[exportKind]}</pre>
              <button
                type="button"
                className="wx-btn"
                onClick={() => copyText(exports[exportKind!], "Export")}
              >
                Copy snippet
              </button>
            </div>
          ) : null}

          {varKeys.length > 0 ? (
            <div className="wx-vars">
              <h3>Template variables</h3>
              <div className="wx-var-grid">
                {varKeys.map((key) => (
                  <label key={key}>
                    <span>{`{{${key}}}`}</span>
                    <input
                      value={vars[key] ?? ""}
                      onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={key}
                    />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="wx-stats">
            <div className="wx-stat">
              <span>Input tokens</span>
              <strong className="wx-green">{input.tokens.toLocaleString()}</strong>
              <em>
                {input.words} words · {input.characters} chars
              </em>
            </div>
            <div className="wx-stat">
              <span>{model.label} cost</span>
              <strong className="wx-blue">${cost.total.toFixed(4)}</strong>
              <em>
                in ${cost.inputCost.toFixed(4)} · out ${cost.outputCost.toFixed(4)} · ratio 1:
                {outputRatio}
              </em>
            </div>
            <div className="wx-stat">
              <span>Context fill</span>
              <strong className="wx-amber">{fill.pct.toFixed(1)}%</strong>
              <em>
                {fill.used.toLocaleString()} used · {fill.remaining.toLocaleString()} left
              </em>
              <div className={`wx-meter wx-meter-${fill.status}`}>
                <span style={{ width: `${Math.min(100, fill.pct)}%` }} />
              </div>
            </div>
          </div>

          {status ? <p className="wx-status">{status}</p> : null}
        </div>

        <aside className="wx-side">
          <section className="wx-panel">
            <h2>Model</h2>
            <div className="wx-models">
              {PRICE_MODELS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={modelId === item.id ? "active" : undefined}
                  onClick={() => setModelId(item.id)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.provider}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="wx-panel">
            <h2>Output ratio</h2>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={outputRatio}
              onChange={(e) => setOutputRatio(Number(e.target.value))}
            />
            <div className="wx-ratio-presets">
              {[
                { v: 0.5, l: "Short" },
                { v: 1, l: "Chat" },
                { v: 3, l: "Detailed" },
                { v: 5, l: "Long" },
              ].map((p) => (
                <button
                  key={p.v}
                  type="button"
                  className={outputRatio === p.v ? "active" : undefined}
                  onClick={() => setOutputRatio(p.v)}
                >
                  1:{p.v} {p.l}
                </button>
              ))}
            </div>
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Cost comparison</h2>
              <div className="wx-seg wx-seg-mini">
                <button
                  type="button"
                  className={compareMode === "chart" ? "active" : undefined}
                  onClick={() => setCompareMode("chart")}
                >
                  Chart
                </button>
                <button
                  type="button"
                  className={compareMode === "table" ? "active" : undefined}
                  onClick={() => setCompareMode("table")}
                >
                  Table
                </button>
              </div>
            </div>
            <p className="wx-cheap">Cheapest: {rows[0]?.model.label ?? "—"}</p>
            {compareMode === "chart" ? (
              <ul className="wx-bars">
                {rows.slice(0, 8).map((row) => (
                  <li key={row.model.id}>
                    <div className="wx-bar-label">
                      <span>{row.model.label}</span>
                      <span>${row.cost.total.toFixed(4)}</span>
                    </div>
                    <div className="wx-bar-track">
                      <span style={{ width: `${(row.cost.total / maxBar) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="wx-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>Total</th>
                      <th>Fill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.model.id}>
                        <td>{row.model.label}</td>
                        <td>${row.cost.total.toFixed(4)}</td>
                        <td>{row.fill.pct.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Versions</h2>
              <button type="button" className="wx-btn wx-btn-tiny" onClick={onSaveVersion}>
                + Save
              </button>
            </div>
            {versions.length === 0 ? (
              <p className="wx-muted">Save versions to track edits.</p>
            ) : (
              <ul className="wx-list">
                {versions.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => { setMode("single"); setText(item.text); }}>
                      {item.preview}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Saved prompts</h2>
              <button type="button" className="wx-btn wx-btn-tiny" onClick={onSaveSnippet}>
                Save
              </button>
            </div>
            {snippets.length === 0 ? (
              <p className="wx-muted">Pin prompts you reuse often.</p>
            ) : (
              <ul className="wx-list">
                {snippets.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => { setMode("single"); setText(item.text); }}>
                      {item.preview}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="wx-panel">
            <h2>History</h2>
            {history.length === 0 ? (
              <p className="wx-muted">Recent prompts appear here.</p>
            ) : (
              <ul className="wx-list">
                {history.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => { setMode("single"); setText(item.text); }}>
                      <strong>{item.preview}</strong>
                      <span>
                        {item.tokens ?? "—"} tok · {item.modelId ?? ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

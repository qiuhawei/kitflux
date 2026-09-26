"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PRICE_MODELS,
  PROMPT_TEMPLATES,
  PROVIDERS,
  SAMPLE_PROMPT,
  buildFromParts,
  bumpSession,
  chainToText,
  compareCosts,
  contextFill,
  countTokens,
  diffLines,
  encodeShareHash,
  estimateCost,
  estimateLatencyMs,
  exportSnippets,
  extractVariableKeys,
  heatmapSegments,
  loadAccumulator,
  loadHistory,
  loadSession,
  loadSnippets,
  loadVersions,
  measureOutputRatio,
  optimizePrompt,
  promptTips,
  pushHistory,
  readShareHash,
  resolveVariables,
  saveAccumulator,
  saveSnippet,
  saveVersion,
  shareUrl,
  turnsToText,
  type ChainStep,
  type ChatTurn,
  type LabHistoryItem,
  type SessionStats,
} from "@/lib/aiLab";

type Mode = "single" | "conversation";
type View = "edit" | "heatmap" | "optimize";
type CreateTab = null | "templates" | "builder" | "chain";
type ExportKind = "curl" | "python" | "node" | null;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function newTurn(role: ChatTurn["role"], content = ""): ChatTurn {
  return { id: uid(), role, content };
}

function newStep(): ChainStep {
  return { id: uid(), name: "Step", modelId: PRICE_MODELS[0].id, prompt: "" };
}

export function PromptWorkspace() {
  const [mode, setMode] = useState<Mode>("single");
  const [view, setView] = useState<View>("edit");
  const [createTab, setCreateTab] = useState<CreateTab>(null);
  const [text, setText] = useState(SAMPLE_PROMPT);
  const [turns, setTurns] = useState<ChatTurn[]>([
    newTurn("system", "You are a careful assistant."),
    newTurn("user", "Explain tokens vs words in one short paragraph."),
  ]);
  const [modelId, setModelId] = useState("gpt-4o");
  const [providerFilter, setProviderFilter] = useState("All");
  const [outputRatio, setOutputRatio] = useState(3);
  const [requests, setRequests] = useState(1000);
  const [vars, setVars] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<LabHistoryItem[]>([]);
  const [versions, setVersions] = useState<LabHistoryItem[]>([]);
  const [snippets, setSnippets] = useState<LabHistoryItem[]>([]);
  const [accum, setAccum] = useState<string[]>([]);
  const [session, setSession] = useState<SessionStats>({ prompts: 0, tokens: 0, cost: 0 });
  const [status, setStatus] = useState("");
  const [exportKind, setExportKind] = useState<ExportKind>(null);
  const [compareMode, setCompareMode] = useState<"chart" | "table">("chart");
  const [undoText, setUndoText] = useState<string | null>(null);
  const [showRatioCalc, setShowRatioCalc] = useState(false);
  const [ratioResponse, setRatioResponse] = useState("");
  const [diffA, setDiffA] = useState<string | null>(null);
  const [diffB, setDiffB] = useState<string | null>(null);
  const [builder, setBuilder] = useState({
    role: "You are a concise expert.",
    task: "",
    context: "",
    constraints: "Be direct. No fluff.",
    format: "Bullets",
    examples: "",
  });
  const [chain, setChain] = useState<ChainStep[]>([newStep(), newStep()]);
  const sessionBump = useRef("");

  const model = PRICE_MODELS.find((m) => m.id === modelId) ?? PRICE_MODELS[0];
  const filteredModels =
    providerFilter === "All"
      ? PRICE_MODELS
      : PRICE_MODELS.filter((m) => m.provider === providerFilter);

  useEffect(() => {
    setHistory(loadHistory());
    setVersions(loadVersions());
    setSnippets(loadSnippets());
    setAccum(loadAccumulator());
    setSession(loadSession());
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
  const monthly = useMemo(
    () => estimateCost({ model, inputTokens: input.tokens, outputTokens, requests }),
    [model, input.tokens, outputTokens, requests],
  );
  const fill = contextFill(input.tokens, outputTokens, model.contextWindow);
  const latency = estimateLatencyMs(input.tokens, outputTokens);
  const rows = useMemo(() => compareCosts(resolved, outputRatio, 1), [resolved, outputRatio]);
  const tips = useMemo(() => promptTips(resolved), [resolved]);
  const optimized = useMemo(() => optimizePrompt(resolved), [resolved]);
  const heat = useMemo(() => heatmapSegments(resolved), [resolved]);
  const exports = useMemo(() => exportSnippets(resolved, model), [resolved, model]);
  const maxBar = Math.max(...rows.map((r) => r.cost.total), 0.000001);
  const measured = useMemo(
    () => measureOutputRatio(resolved, ratioResponse, model),
    [resolved, ratioResponse, model],
  );
  const diffRows = useMemo(
    () => (diffA != null && diffB != null ? diffLines(diffA, diffB) : []),
    [diffA, diffB],
  );

  useEffect(() => {
    if (!resolved.trim() || resolved.length < 20) return;
    const key = `${resolved.slice(0, 80)}:${input.tokens}:${model.id}`;
    if (sessionBump.current === key) return;
    const t = window.setTimeout(() => {
      sessionBump.current = key;
      setSession((prev) => bumpSession(prev, input.tokens, cost.total));
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
    }, 1400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolved, input.tokens, cost.total, model.id]);

  function setPrompt(next: string) {
    setMode("single");
    setText(next);
    setView("edit");
    setCreateTab(null);
  }

  function copyText(value: string, label: string) {
    void navigator.clipboard.writeText(value).then(
      () => setStatus(`${label} copied.`),
      () => setStatus("Copy failed."),
    );
  }

  function onShare() {
    if (resolved.length > 8000) {
      setStatus("Prompt too long for URL share — save a snippet.");
      return;
    }
    const hash = encodeShareHash(resolved);
    void navigator.clipboard.writeText(shareUrl(resolved)).then(() => {
      window.location.hash = hash;
      setStatus("Share link copied — local only, no upload.");
    });
  }

  function applyOptimize() {
    setUndoText(resolved);
    setPrompt(optimized.text);
    const saved = optimized.beforeChars - optimized.afterChars;
    setStatus(saved > 0 ? `Optimized (−${saved} chars).` : "Already lean.");
  }

  function addAccum() {
    if (!resolved.trim()) return;
    const next = [resolved, ...accum].slice(0, 30);
    setAccum(next);
    saveAccumulator(next);
    setStatus("Added to context accumulator.");
  }

  function insertAccum() {
    if (!accum.length) return;
    setPrompt(accum.join("\n\n---\n\n"));
    setStatus(`Inserted ${accum.length} chunks.`);
  }

  return (
    <div className="wx">
      <section className="wx-hero">
        <div className="wx-hero-copy">
          <h1>
            Every <span className="wx-em">token</span> has a <span className="wx-em">price</span>
          </h1>
          <p>
            Count tokens and estimate API cost across {PRICE_MODELS.length} models ·{" "}
            {PROVIDERS.length} providers. Optimize, compare, and ship — 100% in your browser.
          </p>
          <div className="wx-pills">
            <span>
              <strong>{PRICE_MODELS.length}</strong> models
            </span>
            <span>
              <strong>{PROVIDERS.length}</strong> providers
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
              <button type="button" className={mode === "single" ? "active" : undefined} onClick={() => setMode("single")}>
                Single prompt
              </button>
              <button type="button" className={mode === "conversation" ? "active" : undefined} onClick={() => setMode("conversation")}>
                Conversation
              </button>
            </div>
            <div className="wx-actions">
              <button type="button" className={view === "heatmap" ? "wx-btn wx-btn-on" : "wx-btn"} onClick={() => setView(view === "heatmap" ? "edit" : "heatmap")}>
                Heatmap
              </button>
              <button type="button" className={view === "optimize" ? "wx-btn wx-btn-accent" : "wx-btn"} onClick={() => setView(view === "optimize" ? "edit" : "optimize")}>
                {view === "optimize" ? "Hide optimizer" : "Optimize"}
              </button>
              <div className="wx-create">
                <button type="button" className={createTab ? "wx-btn wx-btn-on" : "wx-btn"} onClick={() => setCreateTab(createTab ? null : "templates")}>
                  Create ▾
                </button>
                {createTab ? (
                  <div className="wx-create-menu">
                    {(["templates", "builder", "chain"] as const).map((tab) => (
                      <button key={tab} type="button" className={createTab === tab ? "active" : undefined} onClick={() => setCreateTab(tab)}>
                        {tab[0].toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <button type="button" className="wx-btn" onClick={() => copyText(resolved, "Prompt")}>Copy</button>
              <button type="button" className="wx-btn" onClick={onShare}>Share</button>
              <button type="button" className="wx-btn" onClick={() => setExportKind(exportKind ? null : "curl")}>Export</button>
            </div>
          </div>

          {createTab === "templates" ? (
            <div className="wx-create-panel">
              <h3>Templates</h3>
              <div className="wx-template-grid">
                {PROMPT_TEMPLATES.map((tpl) => (
                  <button key={tpl.id} type="button" onClick={() => { setPrompt(tpl.text); setStatus(`Template: ${tpl.name}`); }}>
                    <strong>{tpl.name}</strong>
                    <span>{tpl.blurb}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {createTab === "builder" ? (
            <div className="wx-create-panel wx-builder">
              <h3>Prompt builder</h3>
              <div className="wx-builder-grid">
                {(
                  [
                    ["role", "Role"],
                    ["task", "Task"],
                    ["context", "Context"],
                    ["constraints", "Constraints"],
                    ["format", "Output format"],
                    ["examples", "Examples"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    <span>{label}</span>
                    <textarea
                      rows={key === "role" || key === "task" ? 2 : 3}
                      value={builder[key]}
                      onChange={(e) => setBuilder((b) => ({ ...b, [key]: e.target.value }))}
                    />
                  </label>
                ))}
              </div>
              <button type="button" className="wx-btn wx-btn-accent" onClick={() => { setPrompt(buildFromParts(builder)); setStatus("Builder applied."); }}>
                Apply builder
              </button>
            </div>
          ) : null}

          {createTab === "chain" ? (
            <div className="wx-create-panel">
              <h3>Prompt chain</h3>
              <div className="wx-chain">
                {chain.map((step, index) => (
                  <div key={step.id} className="wx-chain-step">
                    <div className="wx-chain-head">
                      <input value={step.name} onChange={(e) => setChain((prev) => prev.map((s) => (s.id === step.id ? { ...s, name: e.target.value } : s)))} placeholder={`Step ${index + 1}`} />
                      <select value={step.modelId} onChange={(e) => setChain((prev) => prev.map((s) => (s.id === step.id ? { ...s, modelId: e.target.value } : s)))}>
                        {PRICE_MODELS.map((m) => (
                          <option key={m.id} value={m.id}>{m.label}</option>
                        ))}
                      </select>
                      <button type="button" className="wx-btn wx-btn-tiny" onClick={() => setChain((prev) => prev.filter((s) => s.id !== step.id))} disabled={chain.length <= 1}>Remove</button>
                    </div>
                    <textarea rows={3} value={step.prompt} onChange={(e) => setChain((prev) => prev.map((s) => (s.id === step.id ? { ...s, prompt: e.target.value } : s)))} placeholder="Step prompt…" />
                  </div>
                ))}
              </div>
              <div className="wx-actions">
                <button type="button" className="wx-btn" onClick={() => setChain((prev) => [...prev, newStep()])}>+ Step</button>
                <button type="button" className="wx-btn wx-btn-accent" onClick={() => { setPrompt(chainToText(chain)); setStatus("Chain applied."); }}>Apply chain</button>
              </div>
            </div>
          ) : null}

          {view === "heatmap" ? (
            <div className="wx-heat" aria-label="Token density heatmap">
              {heat.map((seg) => (seg.text ? <span key={seg.key} className={`wx-heat-${seg.level}`}>{seg.text}</span> : null))}
            </div>
          ) : mode === "single" ? (
            <textarea className="wx-editor" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your prompt here…" spellCheck={false} rows={16} />
          ) : (
            <div className="wx-turns">
              {turns.map((turn) => (
                <div key={turn.id} className="wx-turn">
                  <div className="wx-turn-head">
                    <select value={turn.role} onChange={(e) => setTurns((prev) => prev.map((t) => (t.id === turn.id ? { ...t, role: e.target.value as ChatTurn["role"] } : t)))}>
                      <option value="system">system</option>
                      <option value="user">user</option>
                      <option value="assistant">assistant</option>
                    </select>
                    <button type="button" className="wx-btn wx-btn-tiny" onClick={() => setTurns((prev) => prev.filter((t) => t.id !== turn.id))} disabled={turns.length <= 1}>Remove</button>
                  </div>
                  <textarea value={turn.content} onChange={(e) => setTurns((prev) => prev.map((t) => (t.id === turn.id ? { ...t, content: e.target.value } : t)))} rows={4} spellCheck={false} />
                </div>
              ))}
              <button type="button" className="wx-btn" onClick={() => setTurns((prev) => [...prev, newTurn("user")])}>+ Add message</button>
            </div>
          )}

          <div className="wx-meta">
            <span>
              {input.tokens.toLocaleString()} / {model.contextWindow.toLocaleString()}
              {input.exact ? " · exact" : " · estimate"}
            </span>
            <button type="button" className="wx-linkish" onClick={() => setPrompt(SAMPLE_PROMPT)}>Reload sample</button>
          </div>

          {view === "optimize" ? (
            <div className="wx-optimize">
              <div className="wx-optimize-head">
                <h2>Prompt tips based on your draft</h2>
                <div className="wx-actions">
                  <button type="button" className="wx-btn wx-btn-accent" onClick={applyOptimize}>Apply cleanup</button>
                  {undoText != null ? <button type="button" className="wx-btn" onClick={() => { setPrompt(undoText); setUndoText(null); }}>Undo</button> : null}
                </div>
              </div>
              <div className="wx-tips">
                {tips.map((tip) => (
                  <article key={tip.id}><strong>{tip.title}</strong><p>{tip.body}</p></article>
                ))}
              </div>
              {optimized.hits.length > 0 ? (
                <ul className="wx-hits">
                  {optimized.hits.map((hit) => (
                    <li key={hit.id}><strong>{hit.label}</strong><span>{hit.detail} (−{hit.savedChars})</span></li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {exportKind ? (
            <div className="wx-export">
              <div className="wx-seg">
                {(["curl", "python", "node"] as const).map((kind) => (
                  <button key={kind} type="button" className={exportKind === kind ? "active" : undefined} onClick={() => setExportKind(kind)}>{kind}</button>
                ))}
              </div>
              <pre>{exports[exportKind]}</pre>
              <button type="button" className="wx-btn" onClick={() => copyText(exports[exportKind!], "Export")}>Copy snippet</button>
            </div>
          ) : null}

          {varKeys.length > 0 ? (
            <div className="wx-vars">
              <h3>Template variables</h3>
              <div className="wx-var-grid">
                {varKeys.map((key) => (
                  <label key={key}>
                    <span>{`{{${key}}}`}</span>
                    <input value={vars[key] ?? ""} onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))} placeholder={key} />
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="wx-stats">
            <div className="wx-stat">
              <span>Input tokens</span>
              <strong className="wx-green">{input.tokens.toLocaleString()}</strong>
              <em>{input.words} words · {input.characters} chars</em>
            </div>
            <div className="wx-stat">
              <span>{model.label} cost</span>
              <strong className="wx-blue">${cost.total.toFixed(4)}</strong>
              <em>in ${cost.inputCost.toFixed(4)} · out ${cost.outputCost.toFixed(4)} · 1:{outputRatio}</em>
            </div>
            <div className="wx-stat">
              <span>Est. latency</span>
              <strong className="wx-latency">{latency ? `${(latency / 1000).toFixed(1)}s` : "—"}</strong>
              <em>heuristic · not a live API call</em>
            </div>
            <div className="wx-stat">
              <span>Context fill</span>
              <strong className="wx-amber">{fill.pct.toFixed(1)}%</strong>
              <em>{fill.used.toLocaleString()} used · {fill.remaining.toLocaleString()} left</em>
              <div className={`wx-meter wx-meter-${fill.status}`}><span style={{ width: `${Math.min(100, fill.pct)}%` }} /></div>
            </div>
          </div>

          {status ? <p className="wx-status">{status}</p> : null}
        </div>

        <aside className="wx-side">
          <section className="wx-panel">
            <h2>Model</h2>
            <div className="wx-provider-filters">
              <button type="button" className={providerFilter === "All" ? "active" : undefined} onClick={() => setProviderFilter("All")}>All</button>
              {PROVIDERS.map((p) => (
                <button key={p} type="button" className={providerFilter === p ? "active" : undefined} onClick={() => setProviderFilter(p)}>{p}</button>
              ))}
            </div>
            <div className="wx-models">
              {filteredModels.map((item) => (
                <button key={item.id} type="button" className={modelId === item.id ? "active" : undefined} onClick={() => setModelId(item.id)}>
                  <strong>{item.label}</strong>
                  <span>{item.provider}{item.exact ? " · exact" : ""}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="wx-panel">
            <h2>Output ratio</h2>
            <input type="range" min={0.5} max={5} step={0.5} value={outputRatio} onChange={(e) => setOutputRatio(Number(e.target.value))} />
            <div className="wx-ratio-presets">
              {[
                { v: 0.5, l: "Short" },
                { v: 1, l: "Chat" },
                { v: 3, l: "Detailed" },
                { v: 5, l: "Long" },
              ].map((p) => (
                <button key={p.v} type="button" className={outputRatio === p.v ? "active" : undefined} onClick={() => setOutputRatio(p.v)}>1:{p.v} {p.l}</button>
              ))}
            </div>
            <button type="button" className="wx-btn" style={{ marginTop: "0.55rem", width: "100%" }} onClick={() => setShowRatioCalc((v) => !v)}>
              {showRatioCalc ? "Hide ratio calculator" : "Calculate from real data"}
            </button>
            {showRatioCalc ? (
              <div className="wx-ratio-calc">
                <label>
                  <span>Paste a real model response</span>
                  <textarea rows={4} value={ratioResponse} onChange={(e) => setRatioResponse(e.target.value)} placeholder="Model reply…" />
                </label>
                <p className="wx-muted">Measured 1:{measured.ratio.toFixed(2)} ({measured.inTok} in → {measured.outTok} out)</p>
                <button type="button" className="wx-btn wx-btn-accent" disabled={!ratioResponse.trim()} onClick={() => { setOutputRatio(Math.min(5, Math.max(0.5, Math.round(measured.ratio * 2) / 2 || 1))); setStatus("Output ratio updated from real data."); }}>
                  Apply measured ratio
                </button>
              </div>
            ) : null}
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Cost comparison</h2>
              <div className="wx-seg wx-seg-mini">
                <button type="button" className={compareMode === "chart" ? "active" : undefined} onClick={() => setCompareMode("chart")}>Chart</button>
                <button type="button" className={compareMode === "table" ? "active" : undefined} onClick={() => setCompareMode("table")}>Table</button>
              </div>
            </div>
            <p className="wx-cheap">Cheapest: {rows[0]?.model.label ?? "—"}</p>
            <label className="wx-inline-field">
              <span>Requests (projection)</span>
              <input type="number" min={1} value={requests} onChange={(e) => setRequests(Math.max(1, Number(e.target.value) || 1))} />
            </label>
            <p className="wx-muted">${monthly.total.toFixed(4)} on {model.label} × {requests} req</p>
            {compareMode === "chart" ? (
              <ul className="wx-bars">
                {rows.slice(0, 10).map((row) => (
                  <li key={row.model.id}>
                    <div className="wx-bar-label"><span>{row.model.label}</span><span>${row.cost.total.toFixed(4)}</span></div>
                    <div className="wx-bar-track"><span style={{ width: `${(row.cost.total / maxBar) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="wx-table-wrap">
                <table>
                  <thead><tr><th>Model</th><th>Total</th><th>Fill</th></tr></thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.model.id}><td>{row.model.label}</td><td>${row.cost.total.toFixed(4)}</td><td>{row.fill.pct.toFixed(1)}%</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Context accumulator</h2>
              <button type="button" className="wx-btn wx-btn-tiny" onClick={addAccum}>+ Add</button>
            </div>
            {accum.length === 0 ? <p className="wx-muted">Stack chunks, then insert as one payload.</p> : (
              <>
                <ul className="wx-list wx-accum">
                  {accum.map((chunk, i) => (
                    <li key={`${i}-${chunk.slice(0, 12)}`}>
                      <button type="button" onClick={() => setPrompt(chunk)}>{chunk.slice(0, 72).replace(/\s+/g, " ")}</button>
                    </li>
                  ))}
                </ul>
                <div className="wx-actions" style={{ marginTop: "0.45rem" }}>
                  <button type="button" className="wx-btn wx-btn-tiny" onClick={insertAccum}>Insert all</button>
                  <button type="button" className="wx-btn wx-btn-tiny" onClick={() => { setAccum([]); saveAccumulator([]); }}>Clear</button>
                </div>
              </>
            )}
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Versions</h2>
              <button type="button" className="wx-btn wx-btn-tiny" onClick={() => { setVersions(saveVersion(resolved, versions)); setStatus("Version saved."); }}>+ Save</button>
            </div>
            {versions.length === 0 ? <p className="wx-muted">Save versions to track edits.</p> : (
              <ul className="wx-list">
                {versions.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setPrompt(item.text)}>{item.preview}</button>
                    <div className="wx-version-actions">
                      <button type="button" className="wx-btn wx-btn-tiny" onClick={() => setDiffA(item.text)}>A</button>
                      <button type="button" className="wx-btn wx-btn-tiny" onClick={() => setDiffB(item.text)}>B</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {diffA != null && diffB != null ? (
              <div className="wx-diff">
                <div className="wx-panel-head">
                  <h3>A/B diff</h3>
                  <button type="button" className="wx-btn wx-btn-tiny" onClick={() => { setDiffA(null); setDiffB(null); }}>Close</button>
                </div>
                <div className="wx-diff-grid">
                  {diffRows.slice(0, 80).map((row, i) => (
                    <div key={i} className={row.changed ? "changed" : undefined}>
                      <pre>{row.left || " "}</pre>
                      <pre>{row.right || " "}</pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : versions.length > 1 ? <p className="wx-muted">Pick A and B on two versions to diff.</p> : null}
          </section>

          <section className="wx-panel">
            <div className="wx-panel-head">
              <h2>Saved prompts</h2>
              <button type="button" className="wx-btn wx-btn-tiny" onClick={() => { setSnippets(saveSnippet(resolved, snippets)); setStatus("Snippet saved."); }}>Save</button>
            </div>
            {snippets.length === 0 ? <p className="wx-muted">Pin prompts you reuse.</p> : (
              <ul className="wx-list">
                {snippets.map((item) => (
                  <li key={item.id}><button type="button" onClick={() => setPrompt(item.text)}>{item.preview}</button></li>
                ))}
              </ul>
            )}
          </section>

          <section className="wx-panel wx-session">
            <h2>Session</h2>
            <div className="wx-session-grid">
              <div><strong>{session.prompts}</strong><span>prompts</span></div>
              <div><strong>{session.tokens.toLocaleString()}</strong><span>tokens</span></div>
              <div><strong>${session.cost.toFixed(4)}</strong><span>est. cost</span></div>
            </div>
          </section>

          <section className="wx-panel">
            <h2>History</h2>
            {history.length === 0 ? <p className="wx-muted">Recent prompts appear here.</p> : (
              <ul className="wx-list">
                {history.map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setPrompt(item.text)}>
                      <strong>{item.preview}</strong>
                      <span>{item.tokens ?? "—"} tok · {item.modelId ?? ""}</span>
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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PRICE_MODELS,
  PROMPT_TEMPLATES,
  PROVIDERS,
  DEFAULT_MODEL_ID,
  MODELS_UPDATED,
  SAMPLE_PROMPT,
  buildFromParts,
  bumpSession,
  chainToText,
  compareCosts,
  contextFill,
  countTokens,
  encodeShareHash,
  estimateCost,
  estimateLatencyMs,
  exportSnippets,
  extractVariableKeys,
  heatmapSegments,
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
  return { id: uid(), name: "Step", modelId: DEFAULT_MODEL_ID, prompt: "" };
}

export function PromptWorkspace() {
  const [mode, setMode] = useState<Mode>("single");
  const [view, setView] = useState<View>("edit");
  const [createTab, setCreateTab] = useState<CreateTab>(null);
  const [text, setText] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([newTurn("system"), newTurn("user")]);
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [providerFilter, setProviderFilter] = useState("All");
  const [outputRatio, setOutputRatio] = useState(3);
  const [vars, setVars] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<LabHistoryItem[]>([]);
  const [versions, setVersions] = useState<LabHistoryItem[]>([]);
  const [snippets, setSnippets] = useState<LabHistoryItem[]>([]);
  const [session, setSession] = useState<SessionStats>({ prompts: 0, tokens: 0, cost: 0 });
  const [status, setStatus] = useState("");
  const [exportKind, setExportKind] = useState<ExportKind>(null);
  const [compareMode, setCompareMode] = useState<"chart" | "table">("chart");
  const [undoText, setUndoText] = useState<string | null>(null);
  const [showRatioCalc, setShowRatioCalc] = useState(false);
  const [ratioResponse, setRatioResponse] = useState("");
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
    setSession(loadSession());
    const shared = readShareHash();
    if (shared?.trim()) {
      setText(shared);
      setStatus("Loaded from share link.");
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
      setStatus("Too long for URL share — save a snippet.");
      return;
    }
    const hash = encodeShareHash(resolved);
    void navigator.clipboard.writeText(shareUrl(resolved)).then(() => {
      window.location.hash = hash;
      setStatus("Share link copied.");
    });
  }

  function applyOptimize() {
    setUndoText(resolved);
    setPrompt(optimized.text);
    const saved = optimized.beforeChars - optimized.afterChars;
    setStatus(saved > 0 ? `Optimized (−${saved} chars).` : "Already lean.");
  }

  return (
    <div className="wx">
      <header className="wx-masthead">
        <div className="wx-logo" aria-hidden>
          <span className="wx-logo-mark">
            <svg viewBox="0 0 64 40" width="72" height="44" fill="none" aria-hidden>
              <rect x="1" y="1" width="62" height="38" rx="8" fill="#fff" />
              <path
                d="M18 12h10M23 12v16M16 28h14"
                stroke="#2563eb"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="18" cy="18" r="3.5" fill="#10b981" />
              <circle cx="28" cy="18" r="3.5" fill="#2563eb" />
              <path d="M18 18h10" stroke="#94a3b8" strokeWidth="1.4" />
              <path
                d="M40 14h10M40 20h10M40 26h7"
                stroke="#0f172a"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>
          </span>
          <span className="wx-logo-word">fluxkit</span>
        </div>
        <h1 className="wx-headline">
          Every token
          <br />
          has a{" "}
          <span className="wx-price">
            <em>price</em>
            <svg className="wx-price-line" viewBox="0 0 120 8" fill="none" aria-hidden>
              <path
                d="M2 6 Q30 0 60 4 T118 2"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.35"
              />
            </svg>
          </span>
        </h1>
        <p className="wx-sub">
          Count tokens and calculate costs for GPT-5.4, Claude, Gemini, Grok, DeepSeek and{" "}
          {PRICE_MODELS.length - 5}+ more AI models. Optimize your prompts, compare pricing, and
          ship — tokenization runs 100% in your browser, so your prompt content never touches our
          servers.
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
          <span>
            <strong>$0</strong> free forever
          </span>
        </div>
      </header>

      <div className="wx-bench">
        <div className="wx-stage">
          <div className="wx-toolbar">
            <div className="wx-seg" role="tablist" aria-label="Mode">
              <button type="button" className={mode === "single" ? "active" : undefined} onClick={() => setMode("single")}>
                Single prompt
              </button>
              <button type="button" className={mode === "conversation" ? "active" : undefined} onClick={() => setMode("conversation")}>
                Conversation
              </button>
            </div>
            <div className="wx-actions">
              <button type="button" className={view === "heatmap" ? "wx-btn on" : "wx-btn"} onClick={() => setView(view === "heatmap" ? "edit" : "heatmap")}>
                Heatmap
              </button>
              <button type="button" className={view === "optimize" ? "wx-btn accent" : "wx-btn"} onClick={() => setView(view === "optimize" ? "edit" : "optimize")}>
                {view === "optimize" ? "Hide optimizer" : "Optimize"}
              </button>
              <div className="wx-create">
                <button type="button" className={createTab ? "wx-btn on" : "wx-btn"} onClick={() => setCreateTab(createTab ? null : "templates")}>
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
            <div className="wx-sheet">
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
            <div className="wx-sheet">
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
                    <textarea rows={2} value={builder[key]} onChange={(e) => setBuilder((b) => ({ ...b, [key]: e.target.value }))} />
                  </label>
                ))}
              </div>
              <button type="button" className="wx-btn accent" onClick={() => { setPrompt(buildFromParts(builder)); setStatus("Builder applied."); }}>
                Apply builder
              </button>
            </div>
          ) : null}

          {createTab === "chain" ? (
            <div className="wx-sheet">
              {chain.map((step, index) => (
                <div key={step.id} className="wx-chain-step">
                  <div className="wx-chain-head">
                    <input value={step.name} onChange={(e) => setChain((prev) => prev.map((s) => (s.id === step.id ? { ...s, name: e.target.value } : s)))} placeholder={`Step ${index + 1}`} />
                    <select value={step.modelId} onChange={(e) => setChain((prev) => prev.map((s) => (s.id === step.id ? { ...s, modelId: e.target.value } : s)))}>
                      {PRICE_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <textarea rows={2} value={step.prompt} onChange={(e) => setChain((prev) => prev.map((s) => (s.id === step.id ? { ...s, prompt: e.target.value } : s)))} />
                </div>
              ))}
              <div className="wx-actions">
                <button type="button" className="wx-btn" onClick={() => setChain((p) => [...p, newStep()])}>+ Step</button>
                <button type="button" className="wx-btn accent" onClick={() => { setPrompt(chainToText(chain)); setStatus("Chain applied."); }}>Apply chain</button>
              </div>
            </div>
          ) : null}

          <div className="wx-editor-wrap">
            {view === "heatmap" ? (
              <div className="wx-heat">
                {heat.map((seg) => (seg.text ? <span key={seg.key} className={`wx-heat-${seg.level}`}>{seg.text}</span> : null))}
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
                {turns.map((turn) => (
                  <div key={turn.id} className="wx-turn">
                    <div className="wx-turn-head">
                      <select value={turn.role} onChange={(e) => setTurns((prev) => prev.map((t) => (t.id === turn.id ? { ...t, role: e.target.value as ChatTurn["role"] } : t)))}>
                        <option value="system">system</option>
                        <option value="user">user</option>
                        <option value="assistant">assistant</option>
                      </select>
                      <button type="button" className="wx-btn tiny" onClick={() => setTurns((prev) => prev.filter((t) => t.id !== turn.id))} disabled={turns.length <= 1}>Remove</button>
                    </div>
                    <textarea value={turn.content} onChange={(e) => setTurns((prev) => prev.map((t) => (t.id === turn.id ? { ...t, content: e.target.value } : t)))} rows={3} spellCheck={false} />
                  </div>
                ))}
                <button type="button" className="wx-btn" onClick={() => setTurns((prev) => [...prev, newTurn("user")])}>+ Add message</button>
              </div>
            )}
            {!text && mode === "single" && view === "edit" ? (
              <button type="button" className="wx-sample" onClick={() => setPrompt(SAMPLE_PROMPT)}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path d="M10 3a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V4a1 1 0 011-1z" />
                  <path d="M4 16a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
                </svg>
                Try a sample prompt
              </button>
            ) : null}
          </div>

          <div className="wx-meta">
            <span>
              {input.tokens.toLocaleString()} / {model.contextWindow.toLocaleString()}
              {input.exact ? " · exact" : " · estimate"}
              {fill.pct > 0 ? ` · ${fill.pct.toFixed(1)}% fill` : ""}
            </span>
            {text ? (
              <button type="button" className="wx-linkish" onClick={() => setPrompt(SAMPLE_PROMPT)}>Load sample</button>
            ) : null}
          </div>

          {view === "optimize" ? (
            <div className="wx-sheet wx-optimize">
              <div className="wx-optimize-head">
                <h2>Prompt tips</h2>
                <div className="wx-actions">
                  <button type="button" className="wx-btn accent" onClick={applyOptimize}>Apply cleanup</button>
                  {undoText != null ? <button type="button" className="wx-btn" onClick={() => { setPrompt(undoText); setUndoText(null); }}>Undo</button> : null}
                </div>
              </div>
              <div className="wx-tips">
                {tips.map((tip) => (
                  <article key={tip.id}><strong>{tip.title}</strong><p>{tip.body}</p></article>
                ))}
              </div>
            </div>
          ) : null}

          {exportKind ? (
            <div className="wx-sheet">
              <div className="wx-seg">
                {(["curl", "python", "node"] as const).map((kind) => (
                  <button key={kind} type="button" className={exportKind === kind ? "active" : undefined} onClick={() => setExportKind(kind)}>{kind}</button>
                ))}
              </div>
              <pre className="wx-pre">{exports[exportKind]}</pre>
              <button type="button" className="wx-btn" onClick={() => copyText(exports[exportKind!], "Export")}>Copy snippet</button>
            </div>
          ) : null}

          {varKeys.length > 0 ? (
            <div className="wx-sheet wx-var-grid">
              {varKeys.map((key) => (
                <label key={key}>
                  <span>{`{{${key}}}`}</span>
                  <input value={vars[key] ?? ""} onChange={(e) => setVars((prev) => ({ ...prev, [key]: e.target.value }))} />
                </label>
              ))}
            </div>
          ) : null}

          <div className="wx-metrics">
            <div className="wx-metric">
              <span>Input tokens</span>
              <strong className="is-green">{input.tokens.toLocaleString()}</strong>
              <em>
                {input.words} words · {input.characters} chars
              </em>
            </div>
            <div className="wx-metric">
              <span>{model.label}</span>
              <strong className="is-blue">
                {cost.total === 0
                  ? "$0.00"
                  : `$${cost.total < 0.01 ? cost.total.toFixed(4) : cost.total.toFixed(2)}`}
              </strong>
            </div>
            <div className="wx-metric">
              <span>Response time</span>
              <strong className="is-white">
                {input.tokens === 0 ? "--" : `${(latency / 1000).toFixed(1)}s`}
              </strong>
            </div>
          </div>

          {status ? <p className="wx-status">{status}</p> : null}
        </div>

        <aside className="wx-rail">
          <section className="wx-panel">
            <header>
              <h2>Model</h2>
              <span>{MODELS_UPDATED}</span>
            </header>
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
                  <span>{item.exact ? "exact" : "est."}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="wx-panel">
            <header><h2>Output ratio</h2><span>1:{outputRatio}</span></header>
            <input type="range" min={0.5} max={5} step={0.5} value={outputRatio} onChange={(e) => setOutputRatio(Number(e.target.value))} />
            <div className="wx-ratio-presets">
              {[0.5, 1, 3, 5].map((v) => (
                <button key={v} type="button" className={outputRatio === v ? "active" : undefined} onClick={() => setOutputRatio(v)}>1:{v}</button>
              ))}
            </div>
            <button type="button" className="wx-btn block" onClick={() => setShowRatioCalc((v) => !v)}>
              {showRatioCalc ? "Hide calculator" : "Calculate from real data"}
            </button>
            {showRatioCalc ? (
              <div className="wx-ratio-calc">
                <textarea rows={3} value={ratioResponse} onChange={(e) => setRatioResponse(e.target.value)} placeholder="Paste a real model response…" />
                <p className="wx-muted">Measured 1:{measured.ratio.toFixed(2)}</p>
                <button type="button" className="wx-btn accent block" disabled={!ratioResponse.trim()} onClick={() => { setOutputRatio(Math.min(5, Math.max(0.5, Math.round(measured.ratio * 2) / 2 || 1))); setStatus("Ratio updated."); }}>
                  Apply measured ratio
                </button>
              </div>
            ) : null}
          </section>

          <section className="wx-panel">
            <header>
              <h2>Cost comparison</h2>
              <div className="wx-seg mini">
                <button type="button" className={compareMode === "chart" ? "active" : undefined} onClick={() => setCompareMode("chart")}>Chart</button>
                <button type="button" className={compareMode === "table" ? "active" : undefined} onClick={() => setCompareMode("table")}>Table</button>
              </div>
            </header>
            <p className="wx-cheap">Cheapest: {rows[0]?.model.label ?? "—"}</p>
            {compareMode === "chart" ? (
              <ul className="wx-bars">
                {rows.slice(0, 8).map((row) => (
                  <li key={row.model.id}>
                    <div className="wx-bar-label"><span>{row.model.label}</span><span>${row.cost.total.toFixed(4)}</span></div>
                    <div className="wx-bar-track"><span style={{ width: `${(row.cost.total / maxBar) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="wx-table-wrap">
                <table>
                  <thead><tr><th>Model</th><th>$</th></tr></thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.model.id}><td>{row.model.label}</td><td>${row.cost.total.toFixed(4)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="wx-panel">
            <header>
              <h2>Versions</h2>
              <button type="button" className="wx-btn tiny" onClick={() => { setVersions(saveVersion(resolved, versions)); setStatus("Version saved."); }}>+ Save</button>
            </header>
            {versions.length === 0 ? <p className="wx-muted">Save versions to track changes.</p> : (
              <ul className="wx-list">
                {versions.map((item) => (
                  <li key={item.id}><button type="button" onClick={() => setPrompt(item.text)}>{item.preview}</button></li>
                ))}
              </ul>
            )}
          </section>

          <section className="wx-panel">
            <header>
              <h2>Saved prompts</h2>
              <button type="button" className="wx-btn tiny" onClick={() => { setSnippets(saveSnippet(resolved, snippets)); setStatus("Snippet saved."); }}>Save</button>
            </header>
            {snippets.length === 0 ? <p className="wx-muted">Pin prompts you reuse often.</p> : (
              <ul className="wx-list">
                {snippets.map((item) => (
                  <li key={item.id}><button type="button" onClick={() => setPrompt(item.text)}>{item.preview}</button></li>
                ))}
              </ul>
            )}
          </section>

          <section className="wx-panel">
            <header><h2>Session</h2></header>
            <div className="wx-session-grid">
              <div><strong>{session.prompts}</strong><span>prompts</span></div>
              <div><strong>{session.tokens.toLocaleString()}</strong><span>tokens</span></div>
              <div><strong>${session.cost.toFixed(3)}</strong><span>est.</span></div>
            </div>
          </section>

          <section className="wx-panel">
            <header><h2>History</h2></header>
            {history.length === 0 ? <p className="wx-muted">Recent prompts appear here.</p> : (
              <ul className="wx-list">
                {history.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button type="button" onClick={() => setPrompt(item.text)}>
                      <strong>{item.preview}</strong>
                      <span>{item.tokens ?? "—"} tok</span>
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

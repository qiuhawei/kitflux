"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { estimateTokens, optimizePrompt, TOKEN_PRESETS } from "@/lib/aiLab";

const SAMPLE = `Please note that it is important to remember that you are a careful analyst.
In order to help the user, make sure to explain the tradeoffs as well as the risks.
Due to the fact that context is limited, feel free to keep answers short.
At this point in time, prefer bullets over paragraphs.

Please note that it is important to remember that you are a careful analyst.`;

export function PromptOptimizerTool() {
  const [text, setText] = useState(SAMPLE);
  const [presetId, setPresetId] = useState("gpt");

  const preset = TOKEN_PRESETS.find((item) => item.id === presetId) ?? TOKEN_PRESETS[0];
  const result = useMemo(() => optimizePrompt(text), [text]);
  const before = useMemo(
    () => estimateTokens(text, preset.charsPerToken),
    [text, preset.charsPerToken],
  );
  const after = useMemo(
    () => estimateTokens(result.text, preset.charsPerToken),
    [result.text, preset.charsPerToken],
  );
  const savedTokens = Math.max(0, before.tokens - after.tokens);

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Local, rule-based compression — no API rewrite. For the full workflow open{" "}
        <a href="/ai">AI Lab</a>. Guide:{" "}
        <a href="/guides/prompt-optimizer-cut-tokens">cut tokens with a prompt optimizer</a>.
      </p>

      <div className="tool-actions" role="group" aria-label="Model estimate">
        {TOKEN_PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={presetId === item.id ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => setPresetId(item.id)}
            aria-pressed={presetId === item.id}
          >
            {item.short}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setText(result.text)}
          disabled={result.text === text}
        >
          Apply optimized
        </button>
        <CopyButton value={result.text} label="Copy optimized" />
      </div>

      <div className="stat-grid" aria-live="polite">
        <div>
          <strong>{before.tokens}</strong>
          <span>Before tokens</span>
        </div>
        <div>
          <strong>{after.tokens}</strong>
          <span>After tokens</span>
        </div>
        <div>
          <strong>−{savedTokens}</strong>
          <span>Tokens saved</span>
        </div>
        <div>
          <strong>−{Math.max(0, before.characters - after.characters)}</strong>
          <span>Chars saved</span>
        </div>
      </div>

      {result.hits.length > 0 ? (
        <ul className="optimize-hits">
          {result.hits.map((hit) => (
            <li key={hit.id}>
              <strong>{hit.label}</strong>
              <span>
                {hit.detail} (−{hit.savedChars} chars)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tool-info">No filler rules matched — try a wordier system prompt.</p>
      )}

      <div className="split-editors">
        <label className="field">
          <span>Original</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            spellCheck={false}
          />
        </label>
        <label className="field">
          <span>Optimized preview</span>
          <textarea value={result.text} readOnly rows={14} spellCheck={false} />
        </label>
      </div>
    </div>
  );
}

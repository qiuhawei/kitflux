"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { TOKEN_PRESETS, estimateTokens } from "@/lib/aiLab";

export function AiTokenCounterTool() {
  const [text, setText] = useState(
    "Explain quantum computing in simple terms for a beginner.",
  );
  const [presetId, setPresetId] = useState("gpt");

  const preset = TOKEN_PRESETS.find((item) => item.id === presetId) ?? TOKEN_PRESETS[0];
  const stats = useMemo(
    () => estimateTokens(text, preset.charsPerToken),
    [text, preset.charsPerToken],
  );

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Need tokens + cost + templates together? Open the{" "}
        <a href="/ai">AI Lab workspace</a> — this page is the focused counter. New to tokens? Read
        the <a href="/guides/chatgpt-token-counter-guide">token guide</a> or{" "}
        <a href="/guides/private-ai-token-counter">private counting</a>.
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
            {item.label}
          </button>
        ))}
        <CopyButton value={String(stats.tokens)} label="Copy tokens" />
      </div>
      <div className="stat-grid" aria-live="polite">
        <div>
          <strong>{stats.tokens}</strong>
          <span>Est. tokens</span>
        </div>
        <div>
          <strong>{stats.words}</strong>
          <span>Words</span>
        </div>
        <div>
          <strong>{stats.characters}</strong>
          <span>Characters</span>
        </div>
      </div>
      <label className="field">
        <span>Prompt or message</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="Paste your prompt or AI reply…"
        />
      </label>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type ModelPreset = {
  id: string;
  label: string;
  /** Rough chars-per-token for English-heavy text */
  charsPerToken: number;
};

const PRESETS: ModelPreset[] = [
  { id: "gpt", label: "ChatGPT / GPT-4o (approx.)", charsPerToken: 4 },
  { id: "claude", label: "Claude (approx.)", charsPerToken: 3.5 },
  { id: "gemini", label: "Gemini (approx.)", charsPerToken: 4 },
];

export function AiTokenCounterTool() {
  const [text, setText] = useState(
    "Explain quantum computing in simple terms for a beginner.",
  );
  const [presetId, setPresetId] = useState("gpt");

  const preset = PRESETS.find((item) => item.id === presetId) ?? PRESETS[0];

  const stats = useMemo(() => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const tokens = characters === 0 ? 0 : Math.max(1, Math.ceil(characters / preset.charsPerToken));
    return { characters, words, tokens };
  }, [text, preset.charsPerToken]);

  return (
    <div className="tool-panel">
      <div className="tool-actions" role="group" aria-label="Model estimate">
        {PRESETS.map((item) => (
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
      <p className="tool-hint">
        Estimates only — real tokenizers differ by model. Useful for prompt budgeting before you
        paste into ChatGPT, Claude, or an API.
      </p>
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

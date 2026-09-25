"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed
      ? trimmed.split(/[.!?]+/).filter((part) => part.trim().length > 0).length
      : 0;
    const paragraphs = trimmed
      ? trimmed.split(/\n+/).filter((part) => part.trim().length > 0).length
      : 0;
    const readingMinutes = words / 200;

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      reading:
        words === 0
          ? "0 min"
          : readingMinutes < 1
            ? "< 1 min"
            : `${Math.ceil(readingMinutes)} min`,
    };
  }, [text]);

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setText("")} disabled={!text}>
          Clear
        </button>
        <CopyButton value={text} label="Copy text" />
      </div>
      <div className="stat-grid" aria-live="polite">
        <div>
          <strong>{stats.words}</strong>
          <span>Words</span>
        </div>
        <div>
          <strong>{stats.characters}</strong>
          <span>Characters</span>
        </div>
        <div>
          <strong>{stats.charactersNoSpaces}</strong>
          <span>No spaces</span>
        </div>
        <div>
          <strong>{stats.sentences}</strong>
          <span>Sentences</span>
        </div>
        <div>
          <strong>{stats.paragraphs}</strong>
          <span>Paragraphs</span>
        </div>
        <div>
          <strong>{stats.reading}</strong>
          <span>Reading time</span>
        </div>
      </div>
      <label className="field">
        <span>Your text</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={14}
          placeholder="Paste or type text to count words and characters…"
        />
      </label>
    </div>
  );
}

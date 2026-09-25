"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "ut",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
];

type Mode = "paragraphs" | "sentences" | "words";

function sentence(length: number) {
  const parts = Array.from({ length }, (_, index) => {
    const word = WORDS[(index * 7 + length) % WORDS.length];
    return index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
  });
  return `${parts.join(" ")}.`;
}

export function LoremIpsumTool() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(0);

  const output = useMemo(() => {
    const safeCount = Math.min(50, Math.max(1, count));
    const offset = seed % WORDS.length;
    if (mode === "words") {
      return Array.from(
        { length: safeCount },
        (_, index) => WORDS[(index + offset) % WORDS.length],
      ).join(" ");
    }
    if (mode === "sentences") {
      return Array.from({ length: safeCount }, (_, index) =>
        sentence(8 + ((index + seed) % 5)),
      ).join(" ");
    }
    return Array.from({ length: safeCount }, (_, index) =>
      Array.from({ length: 4 + ((index + seed) % 2) }, (__, sentenceIndex) =>
        sentence(9 + sentenceIndex + (seed % 3)),
      ).join(" "),
    ).join("\n\n");
  }, [count, mode, seed]);

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        {(["paragraphs", "sentences", "words"] as Mode[]).map((item) => (
          <button
            key={item}
            type="button"
            className={mode === item ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => setMode(item)}
            aria-pressed={mode === item}
          >
            {item}
          </button>
        ))}
        <label className="field field-compact">
          <span>Count</span>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value) || 1)}
          />
        </label>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setSeed((value) => value + 1)}
        >
          Regenerate
        </button>
        <CopyButton value={output} />
      </div>
      <label className="field">
        <span>Placeholder text</span>
        <textarea value={output} readOnly rows={14} />
      </label>
    </div>
  );
}

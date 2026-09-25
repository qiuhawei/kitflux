"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

function tokenize(input: string) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
}

const converters = {
  camelCase: (words: string[]) =>
    words
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(""),
  PascalCase: (words: string[]) =>
    words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(""),
  snake_case: (words: string[]) => words.join("_"),
  "kebab-case": (words: string[]) => words.join("-"),
  UPPER_SNAKE: (words: string[]) => words.join("_").toUpperCase(),
  "Title Case": (words: string[]) =>
    words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
  "Sentence case": (words: string[]) => {
    const sentence = words.join(" ");
    return sentence ? sentence.charAt(0).toUpperCase() + sentence.slice(1) : "";
  },
} as const;

type CaseKey = keyof typeof converters;

export function CaseConverterTool() {
  const [input, setInput] = useState("flux kit online tools");
  const [active, setActive] = useState<CaseKey>("camelCase");

  const words = useMemo(() => tokenize(input), [input]);
  const allOutputs = useMemo(() => {
    const entries = Object.entries(converters) as [CaseKey, (words: string[]) => string][];
    return entries.map(([key, fn]) => ({ key, value: fn(words) }));
  }, [words]);
  const output = useMemo(() => converters[active](words), [active, words]);

  return (
    <div className="tool-panel">
      <label className="field">
        <span>Input</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Text to convert"
        />
      </label>
      <div className="chip-row" role="group" aria-label="Case styles">
        {(Object.keys(converters) as CaseKey[]).map((key) => (
          <button
            key={key}
            type="button"
            className={active === key ? "chip chip-active" : "chip"}
            onClick={() => setActive(key)}
            aria-pressed={active === key}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="result-box result-row">
        <code>{output || "—"}</code>
        <CopyButton value={output} />
      </div>
      <div className="case-table" aria-label="All case conversions">
        {allOutputs.map((item) => (
          <div key={item.key} className="case-row">
            <span>{item.key}</span>
            <code>{item.value || "—"}</code>
            <CopyButton value={item.value} label="Copy" className="btn btn-ghost btn-small" />
          </div>
        ))}
      </div>
    </div>
  );
}

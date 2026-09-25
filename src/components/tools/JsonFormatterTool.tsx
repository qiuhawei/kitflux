"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { onModEnter } from "@/lib/keyboard";

export function JsonFormatterTool() {
  const [input, setInput] = useState('{\n  "hello": "world"\n}');
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [output, setOutput] = useState("");

  const sample = useMemo(
    () => JSON.stringify({ hello: "world", items: [1, 2, 3], nested: { ok: true } }, null, 2),
    [],
  );

  function format(minify = false) {
    try {
      const parsed = JSON.parse(input);
      const next = JSON.stringify(parsed, null, minify ? 0 : 2);
      setOutput(next);
      setError("");
      setInfo(minify ? "Minified successfully." : "Formatted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setInfo("");
      setOutput("");
    }
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError("");
    setInfo("");
  }

  function swap() {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
    setInfo("Moved output into input.");
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={() => format(false)}>
          Format
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => format(true)}>
          Minify
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setInput(sample);
            setError("");
            setOutput("");
            setInfo("Sample loaded.");
          }}
        >
          Load sample
        </button>
        <button type="button" className="btn btn-ghost" onClick={swap} disabled={!output}>
          Use output
        </button>
        <button type="button" className="btn btn-ghost" onClick={clearAll}>
          Clear
        </button>
        <CopyButton value={output} />
      </div>
      <p className="tool-hint">Tip: press ⌘/Ctrl + Enter in the input to format.</p>
      <div className="split-editors">
        <label className="field">
          <span>Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => onModEnter(e, () => format(false))}
            spellCheck={false}
            rows={14}
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className="field">
          <span>Output</span>
          <textarea value={output} readOnly spellCheck={false} rows={14} />
        </label>
      </div>
      <ToolStatus error={error} info={info} />
    </div>
  );
}

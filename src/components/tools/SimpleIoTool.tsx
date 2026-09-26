"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { onModEnter } from "@/lib/keyboard";

type SimpleIoToolProps = {
  sample?: string;
  placeholder?: string;
  actionLabel?: string;
  transform: (input: string) => string;
};

export function SimpleIoTool({
  sample = "",
  placeholder = "Paste input…",
  actionLabel = "Convert",
  transform,
}: SimpleIoToolProps) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function run() {
    try {
      setOutput(transform(input));
      setError("");
      setInfo("Done.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
      setInfo("");
      setOutput("");
    }
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={run}>
          {actionLabel}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setInput(sample);
            setOutput("");
            setError("");
            setInfo("Sample loaded.");
          }}
          disabled={!sample}
        >
          Sample
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
            setInfo("");
          }}
        >
          Clear
        </button>
        <CopyButton value={output} />
      </div>
      <div className="split-editors">
        <label className="field">
          <span>Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => onModEnter(e, run)}
            rows={12}
            spellCheck={false}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className="field">
          <span>Output</span>
          <textarea value={output} readOnly rows={12} spellCheck={false} />
        </label>
      </div>
      <ToolStatus error={error} info={info} />
    </div>
  );
}

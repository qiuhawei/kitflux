"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { decodeBase64, encodeBase64 } from "@/lib/crypto";
import { onModEnter } from "@/lib/keyboard";

export function Base64Tool() {
  const [input, setInput] = useState("Hello Fluxkit");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function encode() {
    try {
      setOutput(encodeBase64(input));
      setError("");
      setInfo("Encoded successfully.");
    } catch {
      setError("Could not encode this text.");
      setInfo("");
      setOutput("");
    }
  }

  function decode() {
    try {
      setOutput(decodeBase64(input));
      setError("");
      setInfo("Decoded successfully.");
    } catch {
      setError("Invalid Base64 input.");
      setInfo("");
      setOutput("");
    }
  }

  function swap() {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
    setInfo("Moved output into input.");
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setError("");
    setInfo("");
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={encode}>
          Encode
        </button>
        <button type="button" className="btn btn-secondary" onClick={decode}>
          Decode
        </button>
        <button type="button" className="btn btn-ghost" onClick={swap} disabled={!output}>
          Use output
        </button>
        <button type="button" className="btn btn-ghost" onClick={clearAll}>
          Clear
        </button>
        <CopyButton value={output} />
      </div>
      <p className="tool-hint">Tip: ⌘/Ctrl + Enter encodes the input.</p>
      <div className="split-editors">
        <label className="field">
          <span>Input</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => onModEnter(e, encode)}
            rows={10}
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className="field">
          <span>Output</span>
          <textarea value={output} readOnly rows={10} />
        </label>
      </div>
      <ToolStatus error={error} info={info} />
    </div>
  );
}

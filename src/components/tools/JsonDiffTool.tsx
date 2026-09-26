"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";

function diffValues(a: unknown, b: unknown, path = "$"): string[] {
  if (Object.is(a, b)) return [];
  if (typeof a !== typeof b || a === null || b === null || Array.isArray(a) !== Array.isArray(b)) {
    return [`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`];
  }
  if (typeof a !== "object") {
    return [`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`];
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    const lines: string[] = [];
    for (let i = 0; i < max; i += 1) {
      if (i >= a.length) lines.push(`${path}[${i}]: <missing> → ${JSON.stringify(b[i])}`);
      else if (i >= b.length) lines.push(`${path}[${i}]: ${JSON.stringify(a[i])} → <missing>`);
      else lines.push(...diffValues(a[i], b[i], `${path}[${i}]`));
    }
    return lines;
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const keys = Array.from(new Set([...Object.keys(aObj), ...Object.keys(bObj)])).sort();
  const lines: string[] = [];
  for (const key of keys) {
    const next = `${path}.${key}`;
    if (!(key in aObj)) lines.push(`${next}: <missing> → ${JSON.stringify(bObj[key])}`);
    else if (!(key in bObj)) lines.push(`${next}: ${JSON.stringify(aObj[key])} → <missing>`);
    else lines.push(...diffValues(aObj[key], bObj[key], next));
  }
  return lines;
}

export function JsonDiffTool() {
  const [left, setLeft] = useState('{\n  "a": 1,\n  "b": 2\n}');
  const [right, setRight] = useState('{\n  "a": 1,\n  "b": 3,\n  "c": true\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function run() {
    try {
      const a = JSON.parse(left);
      const b = JSON.parse(right);
      const lines = diffValues(a, b);
      setOutput(lines.length ? lines.join("\n") : "No differences");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Diff failed");
      setOutput("");
    }
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={run}>
          Compare
        </button>
        <CopyButton value={output} />
      </div>
      <div className="split-editors">
        <label className="field">
          <span>Left JSON</span>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} rows={12} spellCheck={false} />
        </label>
        <label className="field">
          <span>Right JSON</span>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} rows={12} spellCheck={false} />
        </label>
      </div>
      <label className="field">
        <span>Diff</span>
        <textarea value={output} readOnly rows={8} spellCheck={false} />
      </label>
      <ToolStatus error={error} />
    </div>
  );
}

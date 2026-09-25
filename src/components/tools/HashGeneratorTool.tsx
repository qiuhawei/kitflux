"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";

type Algo = "SHA-1" | "SHA-256" | "SHA-512";

async function digest(algo: Algo, value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function HashGeneratorTool() {
  const [input, setInput] = useState("fluxkit");
  const [algo, setAlgo] = useState<Algo>("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    digest(algo, input)
      .then((value) => {
        if (cancelled) return;
        setOutput(value);
        setError("");
      })
      .catch(() => {
        if (cancelled) return;
        setOutput("");
        setError("Hashing is unavailable in this browser.");
      });
    return () => {
      cancelled = true;
    };
  }, [algo, input]);

  return (
    <div className="tool-panel">
      <div className="tool-actions" role="group" aria-label="Hash algorithm">
        {(["SHA-1", "SHA-256", "SHA-512"] as Algo[]).map((item) => (
          <button
            key={item}
            type="button"
            className={algo === item ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => setAlgo(item)}
            aria-pressed={algo === item}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setInput("")}
          disabled={!input}
        >
          Clear
        </button>
        <CopyButton value={output} />
      </div>
      <label className="field">
        <span>Input</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6} />
      </label>
      <label className="field">
        <span>Hash</span>
        <textarea value={output} readOnly rows={4} spellCheck={false} />
      </label>
      <ToolStatus error={error} />
    </div>
  );
}

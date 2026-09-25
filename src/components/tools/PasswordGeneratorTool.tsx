"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { secureRandomIndex } from "@/lib/crypto";
import { useIsClient } from "@/hooks/useIsClient";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function buildPassword(
  length: number,
  sets: { lower: boolean; upper: boolean; numbers: boolean; symbols: boolean },
) {
  let pool = "";
  if (sets.lower) pool += LOWER;
  if (sets.upper) pool += UPPER;
  if (sets.numbers) pool += NUMBERS;
  if (sets.symbols) pool += SYMBOLS;
  if (!pool) return { password: "", error: "Select at least one character set." };

  let next = "";
  for (let i = 0; i < length; i += 1) {
    next += pool[secureRandomIndex(pool.length)];
  }
  return { password: next, error: "" };
}

export function PasswordGeneratorTool() {
  const isClient = useIsClient();
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function apply(next: {
    length?: number;
    lower?: boolean;
    upper?: boolean;
    numbers?: boolean;
    symbols?: boolean;
    force?: boolean;
  }) {
    const nextLength = next.length ?? length;
    const nextSets = {
      lower: next.lower ?? lower,
      upper: next.upper ?? upper,
      numbers: next.numbers ?? numbers,
      symbols: next.symbols ?? symbols,
    };
    if (next.length !== undefined) setLength(nextLength);
    if (next.lower !== undefined) setLower(nextSets.lower);
    if (next.upper !== undefined) setUpper(nextSets.upper);
    if (next.numbers !== undefined) setNumbers(nextSets.numbers);
    if (next.symbols !== undefined) setSymbols(nextSets.symbols);

    if (!isClient) return;
    if (!password && !next.force) return;

    const result = buildPassword(nextLength, nextSets);
    setPassword(result.password);
    setError(result.error);
  }

  function generate() {
    if (!isClient) return;
    const result = buildPassword(length, { lower, upper, numbers, symbols });
    setPassword(result.password);
    setError(result.error);
  }

  return (
    <div className="tool-panel">
      <div className="password-result">
        <code aria-live="polite">
          {password || "Click Generate to create a password"}
        </code>
        <div className="tool-actions">
          <button type="button" className="btn btn-primary" onClick={generate} disabled={!isClient}>
            Generate
          </button>
          <CopyButton value={password} />
        </div>
      </div>

      <label className="field field-inline">
        <span>Length: {length}</span>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => apply({ length: Number(e.target.value) })}
          aria-valuemin={8}
          aria-valuemax={64}
          aria-valuenow={length}
        />
      </label>

      <div className="checkbox-row" role="group" aria-label="Character sets">
        <label>
          <input
            type="checkbox"
            checked={lower}
            onChange={(e) => apply({ lower: e.target.checked })}
          />
          Lowercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={upper}
            onChange={(e) => apply({ upper: e.target.checked })}
          />
          Uppercase
        </label>
        <label>
          <input
            type="checkbox"
            checked={numbers}
            onChange={(e) => apply({ numbers: e.target.checked })}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            checked={symbols}
            onChange={(e) => apply({ symbols: e.target.checked })}
          />
          Symbols
        </label>
      </div>
      <ToolStatus error={error} />
    </div>
  );
}

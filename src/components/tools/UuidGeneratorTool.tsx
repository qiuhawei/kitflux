"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { createUuid } from "@/lib/crypto";
import { useIsClient } from "@/hooks/useIsClient";

export function UuidGeneratorTool() {
  const isClient = useIsClient();
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);

  function regenerate(nextCount = count) {
    if (!isClient) return;
    setIds(Array.from({ length: nextCount }, createUuid));
  }

  const output = ids.join("\n");

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <label className="field field-compact">
          <span>Count</span>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => {
              setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)));
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => regenerate(count)}
          disabled={!isClient}
        >
          Generate
        </button>
        <CopyButton value={output} label="Copy all" />
      </div>
      <label className="field">
        <span>UUIDs</span>
        <textarea
          value={output || "Click Generate to create UUIDs"}
          readOnly
          rows={12}
          spellCheck={false}
        />
      </label>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { DeprecationEntry } from "@/lib/deprecations";
import { migrationSnippets } from "@/lib/deprecations";

export function MigrationSnippets({ entry }: { entry: DeprecationEntry }) {
  const [lang, setLang] = useState<"python" | "javascript" | "curl">("python");
  const snippets = useMemo(() => migrationSnippets(entry), [entry]);
  const pair = snippets[lang];

  return (
    <div>
      <div className="quickfix-tabs" role="tablist" aria-label="Language">
        {(["python", "javascript", "curl"] as const).map((id) => (
          <button
            key={id}
            type="button"
            className={lang === id ? "active" : undefined}
            onClick={() => setLang(id)}
          >
            {id === "javascript" ? "JavaScript" : id === "curl" ? "cURL" : "Python"}
          </button>
        ))}
      </div>
      <div className="code-pair">
        <div>
          <p className="code-label-bad">Breaks on {entry.shutdown}</p>
          <pre className="wx-pre">{pair.before}</pre>
        </div>
        <div>
          <p className="code-label-good">Use this instead</p>
          <pre className="wx-pre">{pair.after}</pre>
        </div>
      </div>
    </div>
  );
}

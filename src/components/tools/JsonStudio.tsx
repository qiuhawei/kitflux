"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { onModEnter } from "@/lib/keyboard";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function tryParse(raw: string): { ok: true; value: JsonValue } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(raw) as JsonValue };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid JSON" };
  }
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function typeOfValue(value: JsonValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function TreeNode({
  name,
  value,
  path,
  depth = 0,
}: {
  name?: string;
  value: JsonValue;
  path: string;
  depth?: number;
}) {
  const [open, setOpen] = useState(depth < 2);
  const kind = typeOfValue(value);
  const isExpandable = kind === "object" || kind === "array";

  async function copyPath() {
    await copyText(path);
  }

  if (!isExpandable) {
    return (
      <div className="json-tree-row" style={{ paddingLeft: `${depth * 14}px` }}>
        {name !== undefined ? <span className="json-key">{name}: </span> : null}
        <span className={`json-leaf json-${kind}`}>{JSON.stringify(value)}</span>
        <button type="button" className="json-path-btn" onClick={copyPath} title="Copy path">
          path
        </button>
      </div>
    );
  }

  const entries: [string, JsonValue][] = Array.isArray(value)
    ? value.map((item, index) => [String(index), item])
    : Object.entries(value as { [key: string]: JsonValue });

  return (
    <div className="json-tree-node">
      <div className="json-tree-row" style={{ paddingLeft: `${depth * 14}px` }}>
        <button type="button" className="json-toggle" onClick={() => setOpen((v) => !v)}>
          {open ? "▾" : "▸"}
        </button>
        {name !== undefined ? <span className="json-key">{name}: </span> : null}
        <span className="json-meta">
          {kind === "array" ? `Array(${entries.length})` : `Object(${entries.length})`}
        </span>
        <button type="button" className="json-path-btn" onClick={copyPath} title="Copy path">
          path
        </button>
      </div>
      {open
        ? entries.map(([key, child]) => (
            <TreeNode
              key={`${path}.${key}`}
              name={key}
              value={child}
              path={Array.isArray(value) ? `${path}[${key}]` : `${path}.${key}`}
              depth={depth + 1}
            />
          ))
        : null}
    </div>
  );
}

type JsonStudioProps = {
  focusMode?: boolean;
  onToggleFocus?: () => void;
};

export function JsonStudio({ focusMode = false, onToggleFocus }: JsonStudioProps) {
  const [text, setText] = useState('{\n  "hello": "Fluxkit",\n  "items": [1, 2, 3]\n}');
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Ready — paste JSON to validate");
  const [showTree, setShowTree] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [bootstrapped, setBootstrapped] = useState(false);

  const parsed = useMemo(() => tryParse(text), [text]);

  useEffect(() => {
    if (parsed.ok) {
      setError("");
      setStatus("Valid JSON");
    } else if (text.trim()) {
      setError(parsed.error);
      setStatus("Invalid JSON");
    } else {
      setError("");
      setStatus("Empty");
    }
  }, [parsed, text]);

  const applyFormatted = useCallback((minify: boolean) => {
    const result = tryParse(text);
    if (!result.ok) {
      setError(result.error);
      setStatus("Fix errors before formatting");
      return;
    }
    setText(JSON.stringify(result.value, null, minify ? 0 : 2));
    setStatus(minify ? "Compressed" : "Formatted");
  }, [text]);

  const escapeJson = useCallback(() => {
    setText(JSON.stringify(text));
    setStatus("Escaped as JSON string");
  }, [text]);

  const unescapeJson = useCallback(() => {
    const result = tryParse(text);
    if (result.ok && typeof result.value === "string") {
      setText(result.value);
      setStatus("Unescaped string");
      return;
    }
    try {
      const once = JSON.parse(text);
      if (typeof once === "string") {
        setText(once);
        setStatus("Unescaped string");
        return;
      }
      setError("Content is not an escaped JSON string");
      setStatus("Unescape failed");
    } catch {
      setError("Unescape failed — expected a quoted JSON string");
      setStatus("Unescape failed");
    }
  }, [text]);

  // Hash params like json.cn: #data=... or #url=...
  useEffect(() => {
    if (bootstrapped || typeof window === "undefined") return;
    setBootstrapped(true);

    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const data = params.get("data");
    const url = params.get("url");

    async function load() {
      if (data) {
        try {
          setText(decodeURIComponent(data));
          setStatus("Loaded from #data");
        } catch {
          setText(data);
          setStatus("Loaded from #data");
        }
        history.replaceState(null, "", window.location.pathname + window.location.search);
        return;
      }
      if (url) {
        try {
          const target = decodeURIComponent(url);
          const response = await fetch(target);
          const body = await response.text();
          setText(body);
          setStatus(`Loaded from URL`);
        } catch {
          setError("Failed to fetch remote JSON (CORS may block it)");
          setStatus("URL load failed");
        }
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }

    void load();
  }, [bootstrapped]);

  const lineCount = Math.max(1, text.split("\n").length);

  return (
    <div className={focusMode ? "json-studio json-studio-focus" : "json-studio"}>
      <div className="json-toolbar">
        <div className="json-toolbar-left">
          <button type="button" className="json-btn json-btn-primary" onClick={() => applyFormatted(false)}>
            Format
          </button>
          <button type="button" className="json-btn" onClick={() => applyFormatted(true)}>
            Compress
          </button>
          <button type="button" className="json-btn" onClick={escapeJson}>
            Escape
          </button>
          <button type="button" className="json-btn" onClick={unescapeJson}>
            Unescape
          </button>
          <button
            type="button"
            className="json-btn"
            onClick={async () => {
              const ok = await copyText(text);
              setStatus(ok ? "Copied" : "Copy failed");
            }}
          >
            Copy
          </button>
          <button type="button" className="json-btn" onClick={() => downloadText("data.json", text)}>
            Download
          </button>
          <button
            type="button"
            className="json-btn"
            onClick={() => {
              setText("");
              setError("");
              setStatus("Cleared");
            }}
          >
            Clear
          </button>
        </div>
        <div className="json-toolbar-right">
          <button
            type="button"
            className={showTree ? "json-btn json-btn-on" : "json-btn"}
            onClick={() => setShowTree((v) => !v)}
          >
            Tree
          </button>
          <button
            type="button"
            className={showLines ? "json-btn json-btn-on" : "json-btn"}
            onClick={() => setShowLines((v) => !v)}
          >
            Lines
          </button>
          {onToggleFocus ? (
            <button type="button" className="json-btn" onClick={onToggleFocus}>
              {focusMode ? "Exit focus" : "Focus"}
            </button>
          ) : null}
        </div>
      </div>

      <div className={showTree ? "json-workspace has-tree" : "json-workspace"}>
        <div className="json-editor-pane">
          <div className="json-editor-wrap">
            {showLines ? (
              <div className="json-gutter" aria-hidden>
                {Array.from({ length: lineCount }, (_, index) => (
                  <span key={index}>{index + 1}</span>
                ))}
              </div>
            ) : null}
            <textarea
              className="json-editor"
              value={text}
              spellCheck={false}
              placeholder="Paste JSON here…"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => onModEnter(e, () => applyFormatted(false))}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData("text");
                if (!pasted.trim()) return;
                const result = tryParse(pasted);
                if (!result.ok) return;
                e.preventDefault();
                setText(JSON.stringify(result.value, null, 2));
                setStatus("Pasted & formatted");
              }}
              aria-invalid={Boolean(error)}
            />
          </div>
        </div>

        {showTree ? (
          <aside className="json-tree-pane" aria-label="JSON tree">
            <div className="json-tree-head">Structure</div>
            <div className="json-tree-body">
              {parsed.ok ? (
                <TreeNode value={parsed.value} path="$" />
              ) : (
                <p className="json-tree-empty">Fix JSON to preview the tree.</p>
              )}
            </div>
          </aside>
        ) : null}
      </div>

      <div className="json-status-bar">
        <span className={error ? "json-status-bad" : "json-status-ok"}>{status}</span>
        {error ? <span className="json-status-error">{error}</span> : null}
        <span className="json-status-meta">
          {lineCount} lines · {text.length} chars · ⌘/Ctrl+Enter format
        </span>
      </div>
    </div>
  );
}

export function JsonFormatterTool() {
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("fullscreen") === "1" || params.get("fullscreen") === "") {
      setFocusMode(true);
    }
  }, []);

  return <JsonStudio focusMode={focusMode} onToggleFocus={() => setFocusMode((v) => !v)} />;
}

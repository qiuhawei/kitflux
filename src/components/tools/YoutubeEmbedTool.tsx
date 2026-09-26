"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { onModEnter } from "@/lib/keyboard";
import { extractYouTubeId } from "@/lib/video";

export function YoutubeEmbedTool() {
  const [input, setInput] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [start, setStart] = useState("0");
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function run() {
    try {
      const id = extractYouTubeId(input);
      const seconds = Math.max(0, Number.parseInt(start || "0", 10) || 0);
      const src =
        seconds > 0
          ? `https://www.youtube.com/embed/${id}?start=${seconds}`
          : `https://www.youtube.com/embed/${id}`;
      const embed = `<iframe width="560" height="315" src="${src}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
      setOutput(embed);
      setPreview(src);
      setError("");
      setInfo("Embed code ready. Use official embeds — do not hotlink ripper downloads.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setOutput("");
      setPreview("");
      setInfo("");
    }
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={run}>
          Generate embed
        </button>
        <CopyButton value={output} />
      </div>
      <div className="split-editors">
        <label className="field">
          <span>YouTube URL</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => onModEnter(e, run)}
            spellCheck={false}
          />
        </label>
        <label className="field">
          <span>Start at (seconds)</span>
          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            inputMode="numeric"
            spellCheck={false}
          />
        </label>
      </div>
      <label className="field">
        <span>Embed HTML</span>
        <textarea value={output} readOnly rows={5} spellCheck={false} />
      </label>
      {preview ? (
        <div className="embed-preview">
          <iframe
            title="YouTube preview"
            src={preview}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null}
      <ToolStatus error={error} info={info} />
    </div>
  );
}

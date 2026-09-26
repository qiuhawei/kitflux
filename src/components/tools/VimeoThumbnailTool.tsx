"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { onModEnter } from "@/lib/keyboard";
import { extractVimeoId } from "@/lib/video";

type VimeoThumb = {
  thumbnail_url?: string;
  title?: string;
  author_name?: string;
  error?: string;
};

export function VimeoThumbnailTool() {
  const [input, setInput] = useState("https://vimeo.com/148751763");
  const [data, setData] = useState<VimeoThumb | null>(null);
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError("");
    setInfo("");
    setData(null);
    try {
      const nextId = extractVimeoId(input);
      setId(nextId);
      const watch = `https://vimeo.com/${nextId}`;
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(watch)}`);
      const json = (await res.json()) as VimeoThumb;
      if (!res.ok) throw new Error(json.error || "Could not fetch Vimeo info");
      setData(json);
      setInfo("Cover loaded via Vimeo oEmbed (not a video file downloader).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setId("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={run} disabled={loading}>
          {loading ? "Loading…" : "Get Vimeo cover"}
        </button>
        <CopyButton value={id ? `https://vimeo.com/${id}` : ""} label="Copy URL" />
      </div>
      <label className="field">
        <span>Vimeo URL</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => onModEnter(e, () => void run())}
          spellCheck={false}
        />
      </label>
      {data?.thumbnail_url ? (
        <div className="thumb-grid thumb-grid-single">
          <figure className="thumb-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.thumbnail_url} alt={data.title || "Vimeo cover"} />
            <figcaption>
              <strong>{data.title || "Cover"}</strong>
              <a href={data.thumbnail_url} target="_blank" rel="noreferrer">
                Open / save cover
              </a>
            </figcaption>
          </figure>
        </div>
      ) : null}
      <ToolStatus error={error} info={info} />
    </div>
  );
}

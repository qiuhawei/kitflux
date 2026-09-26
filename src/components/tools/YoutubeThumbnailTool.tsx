"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { onModEnter } from "@/lib/keyboard";
import { extractYouTubeId, youtubeThumbnails } from "@/lib/video";

export function YoutubeThumbnailTool() {
  const [input, setInput] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [id, setId] = useState("");
  const [thumbs, setThumbs] = useState<ReturnType<typeof youtubeThumbnails>>([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function run() {
    try {
      const nextId = extractYouTubeId(input);
      setId(nextId);
      setThumbs(youtubeThumbnails(nextId));
      setError("");
      setInfo("Thumbnails ready — open or save an image. This does not download the video file.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setId("");
      setThumbs([]);
      setInfo("");
    }
  }

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Free YouTube <strong>thumbnail</strong> grabber — public cover images only. We do not
        rip or download YouTube video streams (that violates YouTube terms and AdSense rules).
      </p>
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={run}>
          Get thumbnails
        </button>
        <CopyButton value={id ? `https://www.youtube.com/watch?v=${id}` : ""} label="Copy watch URL" />
      </div>
      <label className="field">
        <span>YouTube URL or video ID</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => onModEnter(e, run)}
          placeholder="https://www.youtube.com/watch?v=…"
          spellCheck={false}
        />
      </label>
      {id ? (
        <p className="tool-info">
          Video ID: <code>{id}</code>
        </p>
      ) : null}
      {thumbs.length ? (
        <div className="thumb-grid">
          {thumbs.map((thumb) => (
            <figure key={thumb.quality} className="thumb-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumb.url} alt={`${thumb.label} thumbnail`} loading="lazy" />
              <figcaption>
                <strong>{thumb.label}</strong>
                <a href={thumb.url} target="_blank" rel="noreferrer">
                  Open / save
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      <ToolStatus error={error} info={info} />
    </div>
  );
}

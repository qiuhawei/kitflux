"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { onModEnter } from "@/lib/keyboard";
import { extractTikTokPath } from "@/lib/video";

type OEmbedResult = {
  title?: string;
  author_name?: string;
  author_url?: string;
  thumbnail_url?: string;
  provider_name?: string;
  html?: string;
};

export function TiktokCoverTool() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<OEmbedResult | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setError("");
    setInfo("");
    setData(null);
    try {
      const url = extractTikTokPath(input);
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
      const json = (await res.json()) as OEmbedResult & { error?: string };
      if (!res.ok) throw new Error(json.error || "Could not fetch TikTok info");
      setData(json);
      setInfo(
        "Cover & metadata loaded via official oEmbed. Video file download is not supported (ToS / copyright).",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const summary = data
    ? JSON.stringify(
        {
          title: data.title,
          author: data.author_name,
          author_url: data.author_url,
          thumbnail_url: data.thumbnail_url,
          provider: data.provider_name,
        },
        null,
        2,
      )
    : "";

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Free TikTok <strong>cover &amp; info</strong> tool — uses TikTok’s public oEmbed API. We
        do not provide MP4 rippers for TikTok videos.
      </p>
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={run} disabled={loading}>
          {loading ? "Loading…" : "Fetch cover & info"}
        </button>
        <CopyButton value={summary} />
      </div>
      <label className="field">
        <span>TikTok URL</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => onModEnter(e, () => void run())}
          placeholder="https://www.tiktok.com/@user/video/…"
          spellCheck={false}
        />
      </label>
      {data?.thumbnail_url ? (
        <div className="thumb-grid thumb-grid-single">
          <figure className="thumb-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.thumbnail_url} alt={data.title || "TikTok cover"} />
            <figcaption>
              <strong>{data.title || "Cover"}</strong>
              <a href={data.thumbnail_url} target="_blank" rel="noreferrer">
                Open / save cover
              </a>
            </figcaption>
          </figure>
        </div>
      ) : null}
      {summary ? (
        <label className="field">
          <span>Metadata</span>
          <textarea value={summary} readOnly rows={8} spellCheck={false} />
        </label>
      ) : null}
      <ToolStatus error={error} info={info} />
    </div>
  );
}

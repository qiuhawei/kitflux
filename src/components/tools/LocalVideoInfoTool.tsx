"use client";

import { useRef, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";

type LocalInfo = {
  name: string;
  type: string;
  sizeBytes: number;
  sizeLabel: string;
  durationSeconds: number | null;
  width: number | null;
  height: number | null;
};

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function LocalVideoInfoTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [info, setInfo] = useState<LocalInfo | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  function onFile(file: File | null) {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setObjectUrl(null);
    setInfo(null);
    setError("");
    setStatus("");
    if (!file) return;
    if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov|mkv|m4v)$/i.test(file.name)) {
      setError("Please choose a video file from your device");
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => {
      setInfo({
        name: file.name,
        type: file.type || "unknown",
        sizeBytes: file.size,
        sizeLabel: formatBytes(file.size),
        durationSeconds: Number.isFinite(video.duration) ? Number(video.duration.toFixed(2)) : null,
        width: video.videoWidth || null,
        height: video.videoHeight || null,
      });
      setStatus("Read locally in your browser — file was not uploaded.");
    };
    video.onerror = () => {
      setError("Could not read this video in the browser");
      URL.revokeObjectURL(url);
      setObjectUrl(null);
    };
  }

  const json = info ? JSON.stringify(info, null, 2) : "";

  return (
    <div className="tool-panel">
      <p className="tool-hint">
        Inspect a video <strong>you already have</strong> on your device (duration, size,
        resolution). Ideal for creators checking exports — not a YouTube/TikTok ripper.
      </p>
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={() => inputRef.current?.click()}>
          Choose video file
        </button>
        <CopyButton value={json} />
        <input
          ref={inputRef}
          type="file"
          accept="video/*,.mp4,.webm,.mov,.mkv,.m4v"
          hidden
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {objectUrl ? (
        <video className="local-video-preview" src={objectUrl} controls preload="metadata" />
      ) : null}
      {json ? (
        <label className="field">
          <span>File info</span>
          <textarea value={json} readOnly rows={10} spellCheck={false} />
        </label>
      ) : null}
      <ToolStatus error={error} info={status} />
    </div>
  );
}

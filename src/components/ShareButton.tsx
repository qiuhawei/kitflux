"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";

export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  async function onShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url, text: title });
        setStatus("shared");
        window.setTimeout(() => setStatus("idle"), 1600);
        return;
      } catch {
        // User cancelled or share failed — fall through to copy.
      }
    }
    const ok = await copyText(url);
    setStatus(ok ? "copied" : "idle");
    window.setTimeout(() => setStatus("idle"), 1600);
  }

  const label =
    status === "copied" ? "Link copied" : status === "shared" ? "Shared" : "Share tool";

  return (
    <button type="button" className="btn btn-ghost" onClick={onShare}>
      {label}
    </button>
  );
}

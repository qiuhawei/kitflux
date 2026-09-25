"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

export function CopyButton({
  value,
  label = "Copy",
  className = "btn btn-secondary",
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function onCopy() {
    if (!value) return;
    const ok = await copyText(value);
    setStatus(ok ? "copied" : "failed");
    window.setTimeout(() => setStatus("idle"), 1800);
  }

  const text =
    status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : label;

  return (
    <button
      type="button"
      className={className}
      onClick={onCopy}
      disabled={!value}
      aria-live="polite"
      aria-label={status === "idle" ? label : text}
    >
      {text}
    </button>
  );
}

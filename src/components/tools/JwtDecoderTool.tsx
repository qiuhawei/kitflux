"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

function decodePart(part: string) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function JwtDecoderTool() {
  return (
    <SimpleIoTool
      actionLabel="Decode JWT"
      sample="eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0IiwibmFtZSI6IkZsdXhraXQiLCJhZG1pbiI6dHJ1ZX0."
      placeholder="Paste JWT…"
      transform={(input) => {
        const parts = input.trim().split(".");
        if (parts.length < 2) throw new Error("JWT must have at least header and payload");
        const header = decodePart(parts[0]);
        const payload = decodePart(parts[1]);
        return JSON.stringify({ header, payload, signature: parts[2] ?? null }, null, 2);
      }}
    />
  );
}

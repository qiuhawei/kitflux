"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";
import { parseVideoUrl } from "@/lib/video";

export function VideoUrlParserTool() {
  return (
    <SimpleIoTool
      actionLabel="Parse URL"
      sample="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      placeholder="Paste YouTube, TikTok, Vimeo, or Bilibili URL…"
      transform={(input) => {
        const parsed = parseVideoUrl(input);
        if (parsed.platform === "unknown") {
          throw new Error("Unsupported URL — try YouTube, TikTok, Vimeo, or Bilibili");
        }
        return JSON.stringify(parsed, null, 2);
      }}
    />
  );
}

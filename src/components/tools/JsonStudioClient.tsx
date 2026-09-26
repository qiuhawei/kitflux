"use client";

import { useEffect, useState } from "react";
import { JsonStudio } from "@/components/tools/JsonStudio";

export function JsonStudioClient() {
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("fullscreen")) setFocusMode(true);
  }, []);

  return <JsonStudio focusMode={focusMode} onToggleFocus={() => setFocusMode((v) => !v)} />;
}

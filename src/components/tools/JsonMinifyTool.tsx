"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

export function JsonMinifyTool() {
  return (
    <SimpleIoTool
      actionLabel="Minify"
      sample={`{\n  "ok": true,\n  "items": [1, 2, 3]\n}`}
      transform={(input) => JSON.stringify(JSON.parse(input))}
    />
  );
}

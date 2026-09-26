"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

export function JsonEscapeTool() {
  return (
    <SimpleIoTool
      actionLabel="Escape"
      sample={`{\n  "msg": "hello \\"world\\""\n}`}
      transform={(input) => JSON.stringify(input)}
    />
  );
}

"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

export function JsonValidateTool() {
  return (
    <SimpleIoTool
      actionLabel="Validate"
      sample={`{\n  "ok": true,\n  "count": 3\n}`}
      transform={(input) => {
        const data = JSON.parse(input);
        const type = Array.isArray(data) ? "array" : data === null ? "null" : typeof data;
        return JSON.stringify(
          {
            valid: true,
            type,
            keys:
              data && typeof data === "object" && !Array.isArray(data)
                ? Object.keys(data).length
                : undefined,
            length: Array.isArray(data) ? data.length : undefined,
          },
          null,
          2,
        );
      }}
    />
  );
}

"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

function toTsType(value: unknown, depth = 0): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (!value.length) return "unknown[]";
    return `${toTsType(value[0], depth)}[]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return "Record<string, unknown>";
    const pad = "  ".repeat(depth + 1);
    const close = "  ".repeat(depth);
    const body = entries
      .map(([key, child]) => `${pad}${/^[a-zA-Z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${toTsType(child, depth + 1)};`)
      .join("\n");
    return `{\n${body}\n${close}}`;
  }
  return typeof value;
}

export function JsonToTsTool() {
  return (
    <SimpleIoTool
      actionLabel="To TypeScript"
      sample={`{\n  "id": 1,\n  "name": "Fluxkit",\n  "tags": ["json", "ts"],\n  "meta": { "ok": true }\n}`}
      transform={(input) => {
        const data = JSON.parse(input);
        return `export type Root = ${toTsType(data)};\n`;
      }}
    />
  );
}

"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function JsonCsvTool() {
  return (
    <SimpleIoTool
      actionLabel="To CSV"
      sample={`[\n  {"name": "Ada", "role": "Engineer"},\n  {"name": "Lin", "role": "Designer"}\n]`}
      transform={(input) => {
        const data = JSON.parse(input);
        if (!Array.isArray(data) || !data.length) {
          throw new Error("Input must be a non-empty JSON array of objects");
        }
        if (!data.every((row) => row && typeof row === "object" && !Array.isArray(row))) {
          throw new Error("Every array item must be an object");
        }
        const keys = Array.from(
          data.reduce((set: Set<string>, row) => {
            Object.keys(row as object).forEach((key) => set.add(key));
            return set;
          }, new Set<string>()),
        );
        const lines = [
          keys.join(","),
          ...data.map((row) =>
            keys
              .map((key) => escapeCsv(String((row as Record<string, unknown>)[key] ?? "")))
              .join(","),
          ),
        ];
        return lines.join("\n");
      }}
    />
  );
}

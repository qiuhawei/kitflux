"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.keys(value as object)
      .sort((a, b) => a.localeCompare(b))
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortValue((value as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return value;
}

export function JsonSortTool() {
  return (
    <SimpleIoTool
      actionLabel="Sort keys"
      sample={`{\n  "zebra": 1,\n  "apple": { "b": 2, "a": 1 },\n  "mango": [3, 1, 2]\n}`}
      transform={(input) => JSON.stringify(sortValue(JSON.parse(input)), null, 2)}
    />
  );
}

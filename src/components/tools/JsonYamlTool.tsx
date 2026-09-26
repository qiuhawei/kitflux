"use client";

import { SimpleIoTool } from "@/components/tools/SimpleIoTool";
import { toYaml } from "@/lib/jsonConverters";

export function JsonYamlTool() {
  return (
    <SimpleIoTool
      actionLabel="To YAML"
      sample={`{\n  "name": "Fluxkit",\n  "features": ["format", "validate"],\n  "private": true\n}`}
      transform={(input) => toYaml(JSON.parse(input))}
    />
  );
}

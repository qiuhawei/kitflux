import { Base64Tool } from "@/components/tools/Base64Tool";
import { CaseConverterTool } from "@/components/tools/CaseConverterTool";
import { HashGeneratorTool } from "@/components/tools/HashGeneratorTool";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { LoremIpsumTool } from "@/components/tools/LoremIpsumTool";
import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";
import { TimestampConverterTool } from "@/components/tools/TimestampConverterTool";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";
import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";
import { WordCounterTool } from "@/components/tools/WordCounterTool";

const toolComponents = {
  "json-formatter": JsonFormatterTool,
  "password-generator": PasswordGeneratorTool,
  "word-counter": WordCounterTool,
  "uuid-generator": UuidGeneratorTool,
  base64: Base64Tool,
  "timestamp-converter": TimestampConverterTool,
  "case-converter": CaseConverterTool,
  "hash-generator": HashGeneratorTool,
  "url-encoder": UrlEncoderTool,
  "lorem-ipsum": LoremIpsumTool,
} as const;

export type ToolSlug = keyof typeof toolComponents;

export function renderTool(slug: string) {
  const Component = toolComponents[slug as ToolSlug];
  if (!Component) return null;
  return <Component />;
}

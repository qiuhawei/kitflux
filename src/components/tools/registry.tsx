import { AiCostCalculatorTool } from "@/components/tools/AiCostCalculatorTool";
import { AiLabTool } from "@/components/tools/AiLabTool";
import { AiTokenCounterTool } from "@/components/tools/AiTokenCounterTool";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { CaseConverterTool } from "@/components/tools/CaseConverterTool";
import { ContextWindowTool } from "@/components/tools/ContextWindowTool";
import { HashGeneratorTool } from "@/components/tools/HashGeneratorTool";
import { JsonCsvTool } from "@/components/tools/JsonCsvTool";
import { JsonDiffTool } from "@/components/tools/JsonDiffTool";
import { JsonEscapeTool } from "@/components/tools/JsonEscapeTool";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { JsonMinifyTool } from "@/components/tools/JsonMinifyTool";
import { JsonSortTool } from "@/components/tools/JsonSortTool";
import { JsonToTsTool } from "@/components/tools/JsonToTsTool";
import { JsonValidateTool } from "@/components/tools/JsonValidateTool";
import { JsonYamlTool } from "@/components/tools/JsonYamlTool";
import { JwtDecoderTool } from "@/components/tools/JwtDecoderTool";
import { LocalVideoInfoTool } from "@/components/tools/LocalVideoInfoTool";
import { LoremIpsumTool } from "@/components/tools/LoremIpsumTool";
import { ModelPricingTool } from "@/components/tools/ModelPricingTool";
import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";
import { PromptBuilderTool } from "@/components/tools/PromptBuilderTool";
import { PromptOptimizerTool } from "@/components/tools/PromptOptimizerTool";
import { TiktokCoverTool } from "@/components/tools/TiktokCoverTool";
import { TimestampConverterTool } from "@/components/tools/TimestampConverterTool";
import { UrlEncoderTool } from "@/components/tools/UrlEncoderTool";
import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";
import { VideoUrlParserTool } from "@/components/tools/VideoUrlParserTool";
import { VimeoThumbnailTool } from "@/components/tools/VimeoThumbnailTool";
import { WordCounterTool } from "@/components/tools/WordCounterTool";
import { YoutubeEmbedTool } from "@/components/tools/YoutubeEmbedTool";
import { YoutubeThumbnailTool } from "@/components/tools/YoutubeThumbnailTool";

const toolComponents = {
  "ai-lab": AiLabTool,
  "ai-token-counter": AiTokenCounterTool,
  "prompt-builder": PromptBuilderTool,
  "ai-cost-calculator": AiCostCalculatorTool,
  "prompt-optimizer": PromptOptimizerTool,
  "context-window": ContextWindowTool,
  "model-pricing": ModelPricingTool,
  "json-formatter": JsonFormatterTool,
  "json-validate": JsonValidateTool,
  "json-minify": JsonMinifyTool,
  "json-sort": JsonSortTool,
  "json-yaml": JsonYamlTool,
  "json-csv": JsonCsvTool,
  "json-diff": JsonDiffTool,
  "json-to-ts": JsonToTsTool,
  "json-escape": JsonEscapeTool,
  "jwt-decoder": JwtDecoderTool,
  "youtube-thumbnail": YoutubeThumbnailTool,
  "youtube-embed": YoutubeEmbedTool,
  "tiktok-cover": TiktokCoverTool,
  "vimeo-thumbnail": VimeoThumbnailTool,
  "video-url-parser": VideoUrlParserTool,
  "local-video-info": LocalVideoInfoTool,
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

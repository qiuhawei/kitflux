import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools";

const iconGlyph: Record<string, string> = {
  "json-formatter": "{}",
  "json-validate": "✓",
  "json-minify": "{}",
  "json-sort": "A-Z",
  "json-yaml": "YML",
  "json-csv": "CSV",
  "json-diff": "≠",
  "json-to-ts": "TS",
  "json-escape": "\\",
  "jwt-decoder": "JWT",
  "youtube-thumbnail": "YT",
  "youtube-embed": "▶",
  "tiktok-cover": "TT",
  "vimeo-thumbnail": "Vim",
  "video-url-parser": "URL",
  "local-video-info": "MP4",
  "ai-lab": "Lab",
  "ai-token-counter": "AI",
  "prompt-builder": "✎",
  "ai-cost-calculator": "$",
  "prompt-optimizer": "✂",
  "context-window": "▣",
  "model-pricing": "≈",
  "password-generator": "PW",
  "word-counter": "Abc",
  "uuid-generator": "ID",
  base64: "64",
  "timestamp-converter": "⏱",
  "case-converter": "Aa",
  "hash-generator": "#",
  "url-encoder": "%",
  "lorem-ipsum": "Lor",
};

type PortalCardProps = {
  tool: ToolDefinition;
  href?: string;
};

export function PortalCard({ tool, href }: PortalCardProps) {
  const to = href ?? `/tools/${tool.slug}`;
  const raw = tool.blurb ?? tool.description;
  const blurb = raw.length > 78 ? `${raw.slice(0, 75).trimEnd()}…` : raw;
  return (
    <Link href={to} className="portal-card" data-cat={tool.category}>
      <span className="portal-card-icon" aria-hidden>
        {iconGlyph[tool.slug] ?? tool.shortName.slice(0, 2)}
      </span>
      <span className="portal-card-body">
        <strong>{tool.shortName}</strong>
        <span>{blurb}</span>
      </span>
    </Link>
  );
}

type PortalGridProps = {
  tools: ToolDefinition[];
  hrefFor?: (tool: ToolDefinition) => string | undefined;
};

export function PortalGrid({ tools: items, hrefFor }: PortalGridProps) {
  return (
    <div className="portal-grid">
      {items.map((tool) => (
        <PortalCard key={tool.slug} tool={tool} href={hrefFor?.(tool)} />
      ))}
    </div>
  );
}

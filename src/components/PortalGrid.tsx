import Link from "next/link";
import type { ToolCategory, ToolDefinition } from "@/lib/tools";
import { categories, categoryOrder } from "@/lib/tools";

const iconGlyph: Record<string, string> = {
  "json-formatter": "{}",
  "json-validate": "✓",
  "json-minify": "⟦⟧",
  "json-sort": "A↕",
  "json-yaml": "Y",
  "json-csv": "CSV",
  "json-diff": "≠",
  "json-to-ts": "TS",
  "json-escape": "\\“",
  "jwt-decoder": "JWT",
  "youtube-thumbnail": "YT",
  "youtube-embed": "▶",
  "tiktok-cover": "TT",
  "vimeo-thumbnail": "V",
  "video-url-parser": "URL",
  "local-video-info": "MP4",
  "ai-token-counter": "AI",
  "prompt-builder": "✎",
  "ai-cost-calculator": "$",
  "password-generator": "⌘",
  "word-counter": "W",
  "uuid-generator": "ID",
  base64: "64",
  "timestamp-converter": "⏱",
  "case-converter": "Aa",
  "hash-generator": "#",
  "url-encoder": "%",
  "lorem-ipsum": "¶",
};

type PortalCardProps = {
  tool: ToolDefinition;
  href?: string;
};

export function PortalCard({ tool, href }: PortalCardProps) {
  const to = href ?? `/tools/${tool.slug}`;
  return (
    <Link href={to} className="portal-card" data-cat={tool.category}>
      <span className="portal-card-icon" aria-hidden>
        {iconGlyph[tool.slug] ?? tool.shortName.slice(0, 2)}
      </span>
      <span className="portal-card-body">
        <strong>{tool.shortName}</strong>
        <span>{tool.blurb ?? tool.description}</span>
      </span>
      <span className="portal-card-go" aria-hidden>
        →
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

type CategoryChipsProps = {
  active: ToolCategory | "all";
  counts: Partial<Record<ToolCategory | "all", number>>;
  basePath?: string;
};

export function CategoryChips({ active, counts, basePath = "/tools" }: CategoryChipsProps) {
  const chips: { id: ToolCategory | "all"; label: string }[] = [
    { id: "all", label: "All" },
    ...categoryOrder.map((id) => ({
      id,
      label: categories[id].label,
    })),
  ];

  return (
    <nav className="portal-cats" aria-label="Tool categories">
      {chips.map((chip) => {
        const count = counts[chip.id] ?? 0;
        if (chip.id !== "all" && count === 0) return null;
        const href =
          chip.id === "all" ? basePath : `${basePath}?cat=${encodeURIComponent(chip.id)}`;
        const isActive = active === chip.id;
        return (
          <Link
            key={chip.id}
            href={href}
            className={isActive ? "portal-cat portal-cat-active" : "portal-cat"}
            data-cat={chip.id}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="portal-cat-label">{chip.label}</span>
            <span className="portal-cat-count">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}

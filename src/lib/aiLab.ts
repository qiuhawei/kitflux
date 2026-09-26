export type TokenPreset = {
  id: string;
  label: string;
  short: string;
  charsPerToken: number;
};

export type ModelFamily = "gpt" | "claude" | "gemini" | "deepseek" | "grok" | "mistral";

export type PriceModel = {
  id: string;
  label: string;
  family: ModelFamily;
  inputPerMillion: number;
  outputPerMillion: number;
  contextWindow: number;
};

export type PromptTemplate = {
  id: string;
  name: string;
  role: string;
  task: string;
  format: string;
};

export type OptimizeHit = {
  id: string;
  label: string;
  detail: string;
  savedChars: number;
};

export type OptimizeResult = {
  text: string;
  hits: OptimizeHit[];
  beforeChars: number;
  afterChars: number;
};

/** Planning approximations — labeled as estimates in the UI. */
export const TOKEN_PRESETS: TokenPreset[] = [
  { id: "gpt", label: "ChatGPT / GPT", short: "GPT", charsPerToken: 4 },
  { id: "claude", label: "Claude", short: "Claude", charsPerToken: 3.5 },
  { id: "gemini", label: "Gemini", short: "Gemini", charsPerToken: 4 },
  { id: "deepseek", label: "DeepSeek", short: "DeepSeek", charsPerToken: 3.8 },
  { id: "grok", label: "Grok / xAI", short: "Grok", charsPerToken: 4 },
  { id: "mistral", label: "Mistral", short: "Mistral", charsPerToken: 3.9 },
];

/**
 * Planning price tiers (USD / 1M tokens). Always confirm on vendor pages.
 * Inspired by 2026 market pressure from DeepSeek + Grok long-context tiers —
 * not copied from any competitor UI.
 */
export const PRICE_MODELS: PriceModel[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    family: "gpt",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    contextWindow: 128_000,
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    family: "gpt",
    inputPerMillion: 2.5,
    outputPerMillion: 10,
    contextWindow: 128_000,
  },
  {
    id: "claude-sonnet",
    label: "Claude Sonnet",
    family: "claude",
    inputPerMillion: 3,
    outputPerMillion: 15,
    contextWindow: 200_000,
  },
  {
    id: "claude-haiku",
    label: "Claude Haiku",
    family: "claude",
    inputPerMillion: 0.8,
    outputPerMillion: 4,
    contextWindow: 200_000,
  },
  {
    id: "gemini-flash",
    label: "Gemini Flash",
    family: "gemini",
    inputPerMillion: 0.1,
    outputPerMillion: 0.4,
    contextWindow: 1_000_000,
  },
  {
    id: "deepseek-chat",
    label: "DeepSeek Chat",
    family: "deepseek",
    inputPerMillion: 0.27,
    outputPerMillion: 1.1,
    contextWindow: 128_000,
  },
  {
    id: "deepseek-flash",
    label: "DeepSeek Flash",
    family: "deepseek",
    inputPerMillion: 0.14,
    outputPerMillion: 0.28,
    contextWindow: 1_000_000,
  },
  {
    id: "grok",
    label: "Grok",
    family: "grok",
    inputPerMillion: 2,
    outputPerMillion: 6,
    contextWindow: 500_000,
  },
  {
    id: "mistral-small",
    label: "Mistral Small",
    family: "mistral",
    inputPerMillion: 0.1,
    outputPerMillion: 0.3,
    contextWindow: 128_000,
  },
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "rewrite",
    name: "Rewrite clearly",
    role: "You are a concise editor.",
    task: "Rewrite the text to be clearer and more direct without changing the meaning.",
    format: "Return only the rewritten text.",
  },
  {
    id: "explain",
    name: "Explain simply",
    role: "You are a patient teacher.",
    task: "Explain the topic in simple language for a beginner.",
    format: "Use short paragraphs and one concrete example.",
  },
  {
    id: "code-review",
    name: "Code review",
    role: "You are a senior software engineer.",
    task: "Review the code for bugs, readability, and edge cases.",
    format: "List findings as bullet points, then suggest a patch.",
  },
  {
    id: "seo-outline",
    name: "SEO outline",
    role: "You are an SEO content strategist.",
    task: "Create an outline for an article targeting the keyword.",
    format: "Provide H2/H3 headings and a one-line note under each.",
  },
  {
    id: "api-spec",
    name: "API design",
    role: "You are a staff API designer.",
    task: "Propose a clean REST (or RPC) shape for the feature.",
    format: "Return endpoints, request/response JSON examples, and edge cases.",
  },
  {
    id: "compress",
    name: "Compress prompt",
    role: "You are a prompt compression specialist.",
    task: "Rewrite the instructions to keep the same intent with fewer tokens.",
    format: "Return only the compressed prompt.",
  },
];

const FILLER_PATTERNS: { id: string; label: string; pattern: RegExp; replace: string }[] = [
  {
    id: "please-note",
    label: "Softener phrases",
    pattern: /\bplease\s+note\s+that\b/gi,
    replace: "",
  },
  {
    id: "in-order-to",
    label: "Wordy connectors",
    pattern: /\bin\s+order\s+to\b/gi,
    replace: "to",
  },
  {
    id: "it-is-important",
    label: "Padding openers",
    pattern: /\bit\s+is\s+(important|essential|critical)\s+to\s+(note|remember|understand)\s+that\b/gi,
    replace: "",
  },
  {
    id: "as-well-as",
    label: "Inflated conjunctions",
    pattern: /\bas\s+well\s+as\b/gi,
    replace: "and",
  },
  {
    id: "due-to-the-fact",
    label: "Wordy causation",
    pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi,
    replace: "because",
  },
  {
    id: "at-this-point-in-time",
    label: "Time padding",
    pattern: /\bat\s+this\s+(point|moment)\s+in\s+time\b/gi,
    replace: "now",
  },
  {
    id: "make-sure-to",
    label: "Soft instructions",
    pattern: /\bmake\s+sure\s+to\b/gi,
    replace: "",
  },
  {
    id: "feel-free-to",
    label: "Optional fluff",
    pattern: /\bfeel\s+free\s+to\b/gi,
    replace: "",
  },
];

export function estimateTokens(text: string, charsPerToken: number) {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const tokens = characters === 0 ? 0 : Math.max(1, Math.ceil(characters / charsPerToken));
  return { characters, words, tokens };
}

export function compareTokens(text: string) {
  return TOKEN_PRESETS.map((preset) => ({
    ...preset,
    ...estimateTokens(text, preset.charsPerToken),
  }));
}

export function estimateCost(options: {
  model: PriceModel;
  inputTokens: number;
  outputTokens: number;
  requests: number;
}) {
  const { model, inputTokens, outputTokens, requests } = options;
  const inputCost = (inputTokens / 1_000_000) * model.inputPerMillion * requests;
  const outputCost = (outputTokens / 1_000_000) * model.outputPerMillion * requests;
  const total = inputCost + outputCost;
  return {
    inputCost,
    outputCost,
    total,
    perRequest: requests > 0 ? total / requests : 0,
  };
}

export function contextFill(inputTokens: number, outputTokens: number, contextWindow: number) {
  const used = inputTokens + outputTokens;
  const pct = contextWindow > 0 ? (used / contextWindow) * 100 : 0;
  return {
    used,
    remaining: Math.max(0, contextWindow - used),
    pct: Math.min(999, pct),
    status: pct >= 90 ? "critical" : pct >= 70 ? "warn" : "ok",
  } as const;
}

export function compareCostsAcrossModels(options: {
  text: string;
  outputRatio: number;
  requests: number;
}) {
  const { text, outputRatio, requests } = options;
  return PRICE_MODELS.map((model) => {
    const preset =
      TOKEN_PRESETS.find((item) => item.id === model.family) ?? TOKEN_PRESETS[0];
    const inputTokens = estimateTokens(text, preset.charsPerToken).tokens;
    const outputTokens = Math.max(0, Math.round(inputTokens * outputRatio));
    const cost = estimateCost({ model, inputTokens, outputTokens, requests });
    const fill = contextFill(inputTokens, outputTokens, model.contextWindow);
    return { model, inputTokens, outputTokens, cost, fill };
  }).sort((a, b) => a.cost.total - b.cost.total);
}

/** Local, rule-based prompt compression — no API call. */
export function optimizePrompt(input: string): OptimizeResult {
  const beforeChars = input.length;
  let text = input;
  const hits: OptimizeHit[] = [];

  const collapsed = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ");
  if (collapsed.length < text.length) {
    hits.push({
      id: "whitespace",
      label: "Whitespace",
      detail: "Collapsed extra spaces and blank lines",
      savedChars: text.length - collapsed.length,
    });
    text = collapsed;
  }

  for (const rule of FILLER_PATTERNS) {
    const next = text.replace(rule.pattern, rule.replace);
    if (next !== text) {
      hits.push({
        id: rule.id,
        label: rule.label,
        detail: `Applied: ${rule.label.toLowerCase()}`,
        savedChars: text.length - next.length,
      });
      text = next;
    }
  }

  const lines = text.split("\n");
  const deduped: string[] = [];
  let dupSaved = 0;
  for (const line of lines) {
    const prev = deduped[deduped.length - 1];
    if (prev !== undefined && prev.trim() && prev.trim() === line.trim()) {
      dupSaved += line.length + 1;
      continue;
    }
    deduped.push(line);
  }
  if (dupSaved > 0) {
    hits.push({
      id: "dup-lines",
      label: "Duplicate lines",
      detail: "Removed consecutive identical lines",
      savedChars: dupSaved,
    });
    text = deduped.join("\n");
  }

  text = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "")
    .replace(/ {2,}/g, " ");

  return {
    text,
    hits,
    beforeChars,
    afterChars: text.length,
  };
}

export function buildPrompt(template: PromptTemplate, topic: string, extra: string) {
  return [
    `Role: ${template.role}`,
    `Task: ${template.task}`,
    `Topic / input: ${topic.trim() || "(add your topic)"}`,
    extra.trim() ? `Constraints: ${extra.trim()}` : null,
    `Output format: ${template.format}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export type LabHistoryItem = {
  id: string;
  preview: string;
  text: string;
  savedAt: number;
};

const HISTORY_KEY = "fluxkit-ai-lab-history-v1";

export function loadLabHistory(): LabHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LabHistoryItem[];
    return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
  } catch {
    return [];
  }
}

export function saveLabHistory(text: string, existing: LabHistoryItem[]): LabHistoryItem[] {
  const trimmed = text.trim();
  if (!trimmed) return existing;
  const next: LabHistoryItem = {
    id: `${Date.now()}`,
    preview: trimmed.slice(0, 72).replace(/\s+/g, " "),
    text: trimmed,
    savedAt: Date.now(),
  };
  const deduped = [next, ...existing.filter((item) => item.text !== trimmed)].slice(0, 12);
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(deduped));
  } catch {
    /* ignore quota */
  }
  return deduped;
}

export function clearLabHistory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(HISTORY_KEY);
}

/** Share drafts via URL hash without uploading (same idea as JSON studio #data=). */
export function encodeLabShareHash(text: string) {
  return `#prompt=${encodeURIComponent(text)}`;
}

export function readLabShareHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash.startsWith("#prompt=")) return null;
  try {
    return decodeURIComponent(hash.slice("#prompt=".length));
  } catch {
    return null;
  }
}

export function labShareUrl(text: string, origin = typeof window !== "undefined" ? window.location.origin : "") {
  const path = "/ai";
  return `${origin}${path}${encodeLabShareHash(text)}`;
}

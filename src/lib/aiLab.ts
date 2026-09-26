import { encode } from "gpt-tokenizer";

export type ModelFamily =
  | "gpt"
  | "claude"
  | "gemini"
  | "deepseek"
  | "grok"
  | "mistral"
  | "llama";

export type PriceModel = {
  id: string;
  label: string;
  provider: string;
  family: ModelFamily;
  inputPerMillion: number;
  outputPerMillion: number;
  contextWindow: number;
  /** Exact browser tokenizer for GPT-family via gpt-tokenizer */
  exact: boolean;
  charsPerToken: number;
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

export type PromptTip = {
  id: string;
  title: string;
  body: string;
};

export type ChatTurn = {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
};

/** Planning price tiers — confirm on vendor pages before budgeting. */
export const PRICE_MODELS: PriceModel[] = [
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI", family: "gpt", inputPerMillion: 2.5, outputPerMillion: 10, contextWindow: 128_000, exact: true, charsPerToken: 4 },
  { id: "gpt-4o-mini", label: "GPT-4o mini", provider: "OpenAI", family: "gpt", inputPerMillion: 0.15, outputPerMillion: 0.6, contextWindow: 128_000, exact: true, charsPerToken: 4 },
  { id: "gpt-4.1", label: "GPT-4.1", provider: "OpenAI", family: "gpt", inputPerMillion: 2, outputPerMillion: 8, contextWindow: 1_000_000, exact: true, charsPerToken: 4 },
  { id: "o3", label: "o3", provider: "OpenAI", family: "gpt", inputPerMillion: 10, outputPerMillion: 40, contextWindow: 200_000, exact: true, charsPerToken: 4 },
  { id: "o4-mini", label: "o4-mini", provider: "OpenAI", family: "gpt", inputPerMillion: 1.1, outputPerMillion: 4.4, contextWindow: 200_000, exact: true, charsPerToken: 4 },
  { id: "claude-opus", label: "Claude Opus", provider: "Anthropic", family: "claude", inputPerMillion: 15, outputPerMillion: 75, contextWindow: 200_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-sonnet", label: "Claude Sonnet", provider: "Anthropic", family: "claude", inputPerMillion: 3, outputPerMillion: 15, contextWindow: 200_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-haiku", label: "Claude Haiku", provider: "Anthropic", family: "claude", inputPerMillion: 0.8, outputPerMillion: 4, contextWindow: 200_000, exact: false, charsPerToken: 3.5 },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", family: "gemini", inputPerMillion: 1.25, outputPerMillion: 10, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", family: "gemini", inputPerMillion: 0.15, outputPerMillion: 0.6, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "Google", family: "gemini", inputPerMillion: 0.075, outputPerMillion: 0.3, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "grok", label: "Grok", provider: "xAI", family: "grok", inputPerMillion: 2, outputPerMillion: 6, contextWindow: 500_000, exact: false, charsPerToken: 4 },
  { id: "deepseek-v3", label: "DeepSeek V3", provider: "DeepSeek", family: "deepseek", inputPerMillion: 0.27, outputPerMillion: 1.1, contextWindow: 128_000, exact: false, charsPerToken: 3.8 },
  { id: "deepseek-r1", label: "DeepSeek R1", provider: "DeepSeek", family: "deepseek", inputPerMillion: 0.55, outputPerMillion: 2.19, contextWindow: 128_000, exact: false, charsPerToken: 3.8 },
  { id: "mistral-large", label: "Mistral Large", provider: "Mistral", family: "mistral", inputPerMillion: 2, outputPerMillion: 6, contextWindow: 128_000, exact: false, charsPerToken: 3.9 },
  { id: "mistral-small", label: "Mistral Small", provider: "Mistral", family: "mistral", inputPerMillion: 0.1, outputPerMillion: 0.3, contextWindow: 128_000, exact: false, charsPerToken: 3.9 },
  { id: "llama-3.1-70b", label: "Llama 3.1 70B", provider: "Meta", family: "llama", inputPerMillion: 0.59, outputPerMillion: 0.79, contextWindow: 128_000, exact: false, charsPerToken: 4 },
];

export const PROVIDER_COUNT = new Set(PRICE_MODELS.map((m) => m.provider)).size;

export const SAMPLE_PROMPT = `You are a senior software engineer with deep expertise in TypeScript and React. You prioritize correctness, clarity, and maintainability.

Review the following code. For each issue found:
1. State the severity (critical / major / minor)
2. Explain the problem in one sentence
3. Suggest a concrete fix

Skip praise. Be direct.`;

const FILLER_PATTERNS: { id: string; label: string; pattern: RegExp; replace: string }[] = [
  { id: "please-note", label: "Softener phrases", pattern: /\bplease\s+note\s+that\b/gi, replace: "" },
  { id: "in-order-to", label: "Wordy connectors", pattern: /\bin\s+order\s+to\b/gi, replace: "to" },
  { id: "it-is-important", label: "Padding openers", pattern: /\bit\s+is\s+(important|essential|critical)\s+to\s+(note|remember|understand)\s+that\b/gi, replace: "" },
  { id: "as-well-as", label: "Inflated conjunctions", pattern: /\bas\s+well\s+as\b/gi, replace: "and" },
  { id: "due-to-the-fact", label: "Wordy causation", pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, replace: "because" },
  { id: "at-this-point", label: "Time padding", pattern: /\bat\s+this\s+(point|moment)\s+in\s+time\b/gi, replace: "now" },
  { id: "make-sure-to", label: "Soft instructions", pattern: /\bmake\s+sure\s+to\b/gi, replace: "" },
  { id: "feel-free-to", label: "Optional fluff", pattern: /\bfeel\s+free\s+to\b/gi, replace: "" },
];

export function countTokens(text: string, model: PriceModel) {
  const characters = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  let tokens: number;
  if (!text) {
    tokens = 0;
  } else if (model.exact) {
    try {
      tokens = encode(text).length;
    } catch {
      tokens = Math.max(1, Math.ceil(characters / model.charsPerToken));
    }
  } else {
    tokens = Math.max(1, Math.ceil(characters / model.charsPerToken));
  }
  return { characters, words, tokens, exact: model.exact && characters > 0 };
}

export function estimateCost(options: {
  model: PriceModel;
  inputTokens: number;
  outputTokens: number;
  requests?: number;
}) {
  const requests = options.requests ?? 1;
  const { model, inputTokens, outputTokens } = options;
  const inputCost = (inputTokens / 1_000_000) * model.inputPerMillion * requests;
  const outputCost = (outputTokens / 1_000_000) * model.outputPerMillion * requests;
  const total = inputCost + outputCost;
  return { inputCost, outputCost, total, perRequest: requests > 0 ? total / requests : 0 };
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

export function compareCosts(text: string, outputRatio: number, requests = 1) {
  return PRICE_MODELS.map((model) => {
    const input = countTokens(text, model);
    const outputTokens = Math.max(0, Math.round(input.tokens * outputRatio));
    const cost = estimateCost({ model, inputTokens: input.tokens, outputTokens, requests });
    const fill = contextFill(input.tokens, outputTokens, model.contextWindow);
    return { model, input, outputTokens, cost, fill };
  }).sort((a, b) => a.cost.total - b.cost.total);
}

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

  return { text, hits, beforeChars, afterChars: text.length };
}

export function promptTips(text: string): PromptTip[] {
  const tips: PromptTip[] = [];
  const lower = text.toLowerCase();
  if (!/\b(json|markdown|bullets|format|schema|xml)\b/i.test(text)) {
    tips.push({
      id: "format",
      title: "Specify output format",
      body: "Without format instructions, models default to verbose prose — which costs more tokens.",
    });
  }
  if (!/\b(\d+\s*(words?|sentences?|bullets?|lines?)|max|limit|concise|brief)\b/i.test(text)) {
    tips.push({
      id: "length",
      title: "Add a length constraint",
      body: "Unconstrained output can run 5–10× longer than needed and inflate the bill.",
    });
  }
  if (/\b(please|kindly|i would like|could you)\b/i.test(lower)) {
    tips.push({
      id: "preamble",
      title: "Skip the preamble",
      body: "Polite filler rarely improves answers and often wastes 30–80 tokens per turn.",
    });
  }
  if (!/\b(step[- ]by[- ]step|think|reason|chain of thought)\b/i.test(lower)) {
    tips.push({
      id: "cot",
      title: "Add step-by-step reasoning when accuracy matters",
      body: "For hard tasks, explicit reasoning cuts retries — which often costs more than a longer first pass.",
    });
  }
  if (tips.length === 0) {
    tips.push({
      id: "lean",
      title: "Looking solid",
      body: "Try Optimize to strip filler, or compare costs across models in the sidebar.",
    });
  }
  return tips.slice(0, 4);
}

export function heatmapSegments(text: string) {
  if (!text) return [];
  const parts = text.split(/(\s+)/);
  return parts.map((part, index) => {
    if (/^\s+$/.test(part) || !part) {
      return { key: `${index}`, text: part, level: 0 as const };
    }
    const density = part.length / Math.max(1, part.replace(/[^a-z0-9]/gi, "").length || part.length);
    const level = part.length >= 12 || density > 1.4 ? 3 : part.length >= 8 ? 2 : part.length >= 5 ? 1 : 0;
    return { key: `${index}`, text: part, level: level as 0 | 1 | 2 | 3 };
  });
}

export function turnsToText(turns: ChatTurn[]) {
  return turns
    .filter((t) => t.content.trim())
    .map((t) => `${t.role.toUpperCase()}:\n${t.content.trim()}`)
    .join("\n\n");
}

export function exportSnippets(prompt: string, model: PriceModel) {
  const escaped = prompt.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
  return {
    curl: `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${model.id}","messages":[{"role":"user","content":${JSON.stringify(prompt)}}]}'`,
    python: `from openai import OpenAI
client = OpenAI()
resp = client.chat.completions.create(
    model="${model.id}",
    messages=[{"role": "user", "content": """${prompt.replace(/"""/g, '\\"\\"\\"')}""" }],
)
print(resp.choices[0].message.content)`,
    node: `import OpenAI from "openai";
const client = new OpenAI();
const resp = await client.chat.completions.create({
  model: "${model.id}",
  messages: [{ role: "user", content: \`${escaped}\` }],
});
console.log(resp.choices[0].message.content);`,
  };
}

export function resolveVariables(text: string, vars: Record<string, string>) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) =>
    key in vars ? vars[key] : `{{${key}}}`,
  );
}

export function extractVariableKeys(text: string) {
  const keys = new Set<string>();
  for (const match of text.matchAll(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)) {
    keys.add(match[1]);
  }
  return [...keys];
}

export type LabHistoryItem = {
  id: string;
  preview: string;
  text: string;
  savedAt: number;
  modelId?: string;
  tokens?: number;
};

const HISTORY_KEY = "fluxkit-weigh-history-v1";
const VERSIONS_KEY = "fluxkit-weigh-versions-v1";
const SNIPPETS_KEY = "fluxkit-weigh-snippets-v1";

function readList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function loadHistory() {
  return readList<LabHistoryItem>(HISTORY_KEY).slice(0, 20);
}

export function pushHistory(item: Omit<LabHistoryItem, "id" | "savedAt">, existing: LabHistoryItem[]) {
  const next: LabHistoryItem = {
    ...item,
    id: `${Date.now()}`,
    savedAt: Date.now(),
  };
  const list = [next, ...existing.filter((x) => x.text !== item.text)].slice(0, 20);
  writeList(HISTORY_KEY, list);
  return list;
}

export function loadVersions() {
  return readList<LabHistoryItem>(VERSIONS_KEY).slice(0, 12);
}

export function saveVersion(text: string, existing: LabHistoryItem[]) {
  const trimmed = text.trim();
  if (!trimmed) return existing;
  const next: LabHistoryItem = {
    id: `${Date.now()}`,
    preview: trimmed.slice(0, 72).replace(/\s+/g, " "),
    text: trimmed,
    savedAt: Date.now(),
  };
  const list = [next, ...existing].slice(0, 12);
  writeList(VERSIONS_KEY, list);
  return list;
}

export function loadSnippets() {
  return readList<LabHistoryItem>(SNIPPETS_KEY).slice(0, 20);
}

export function saveSnippet(text: string, existing: LabHistoryItem[]) {
  const trimmed = text.trim();
  if (!trimmed) return existing;
  const next: LabHistoryItem = {
    id: `${Date.now()}`,
    preview: trimmed.slice(0, 72).replace(/\s+/g, " "),
    text: trimmed,
    savedAt: Date.now(),
  };
  const list = [next, ...existing.filter((x) => x.text !== trimmed)].slice(0, 20);
  writeList(SNIPPETS_KEY, list);
  return list;
}

export function encodeShareHash(text: string) {
  return `#prompt=${encodeURIComponent(text)}`;
}

export function readShareHash(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash.startsWith("#prompt=")) return null;
  try {
    return decodeURIComponent(hash.slice("#prompt=".length));
  } catch {
    return null;
  }
}

export function shareUrl(text: string, origin = typeof window !== "undefined" ? window.location.origin : "") {
  return `${origin}/${encodeShareHash(text)}`;
}

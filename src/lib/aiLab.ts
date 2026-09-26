export type TokenPreset = {
  id: string;
  label: string;
  short: string;
  charsPerToken: number;
};

export type PriceModel = {
  id: string;
  label: string;
  family: "gpt" | "claude" | "gemini";
  inputPerMillion: number;
  outputPerMillion: number;
};

export type PromptTemplate = {
  id: string;
  name: string;
  role: string;
  task: string;
  format: string;
};

export const TOKEN_PRESETS: TokenPreset[] = [
  { id: "gpt", label: "ChatGPT / GPT", short: "GPT", charsPerToken: 4 },
  { id: "claude", label: "Claude", short: "Claude", charsPerToken: 3.5 },
  { id: "gemini", label: "Gemini", short: "Gemini", charsPerToken: 4 },
];

export const PRICE_MODELS: PriceModel[] = [
  {
    id: "gpt-4o-mini",
    label: "GPT-4o mini",
    family: "gpt",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
  },
  {
    id: "gpt-4o",
    label: "GPT-4o",
    family: "gpt",
    inputPerMillion: 2.5,
    outputPerMillion: 10,
  },
  {
    id: "claude-sonnet",
    label: "Claude Sonnet",
    family: "claude",
    inputPerMillion: 3,
    outputPerMillion: 15,
  },
  {
    id: "claude-haiku",
    label: "Claude Haiku",
    family: "claude",
    inputPerMillion: 0.8,
    outputPerMillion: 4,
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

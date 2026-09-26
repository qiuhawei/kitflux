import { encode } from "gpt-tokenizer";

export type ModelFamily =
  | "gpt"
  | "claude"
  | "gemini"
  | "deepseek"
  | "grok"
  | "mistral"
  | "llama"
  | "qwen";

export type PriceModel = {
  id: string;
  label: string;
  provider: string;
  family: ModelFamily;
  inputPerMillion: number;
  outputPerMillion: number;
  contextWindow: number;
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

export type PromptTemplate = {
  id: string;
  name: string;
  blurb: string;
  text: string;
};

export type ChainStep = {
  id: string;
  name: string;
  modelId: string;
  prompt: string;
};

/** Planning tiers — confirm on vendor pages. Updated 2026-09-26. */
export const MODELS_UPDATED = "2026-09-26";

export const PRICE_MODELS: PriceModel[] = [
  // OpenAI — current flagship + still-common
  { id: "gpt-5.4", label: "GPT-5.4", provider: "OpenAI", family: "gpt", inputPerMillion: 2.5, outputPerMillion: 15, contextWindow: 400_000, exact: true, charsPerToken: 4 },
  { id: "gpt-5.4-mini", label: "GPT-5.4 mini", provider: "OpenAI", family: "gpt", inputPerMillion: 0.75, outputPerMillion: 4.5, contextWindow: 400_000, exact: true, charsPerToken: 4 },
  { id: "gpt-5", label: "GPT-5", provider: "OpenAI", family: "gpt", inputPerMillion: 1.25, outputPerMillion: 10, contextWindow: 400_000, exact: true, charsPerToken: 4 },
  { id: "gpt-5-pro", label: "GPT-5 Pro", provider: "OpenAI", family: "gpt", inputPerMillion: 15, outputPerMillion: 120, contextWindow: 400_000, exact: true, charsPerToken: 4 },
  { id: "o3", label: "o3", provider: "OpenAI", family: "gpt", inputPerMillion: 10, outputPerMillion: 40, contextWindow: 200_000, exact: true, charsPerToken: 4 },
  { id: "o4-mini", label: "o4-mini", provider: "OpenAI", family: "gpt", inputPerMillion: 1.1, outputPerMillion: 4.4, contextWindow: 200_000, exact: true, charsPerToken: 4 },
  { id: "gpt-4.1", label: "GPT-4.1", provider: "OpenAI", family: "gpt", inputPerMillion: 2, outputPerMillion: 8, contextWindow: 1_047_576, exact: true, charsPerToken: 4 },
  { id: "gpt-4.1-mini", label: "GPT-4.1 mini", provider: "OpenAI", family: "gpt", inputPerMillion: 0.4, outputPerMillion: 1.6, contextWindow: 1_047_576, exact: true, charsPerToken: 4 },
  { id: "gpt-4o", label: "GPT-4o", provider: "OpenAI", family: "gpt", inputPerMillion: 2.5, outputPerMillion: 10, contextWindow: 128_000, exact: true, charsPerToken: 4 },
  { id: "gpt-4o-mini", label: "GPT-4o mini", provider: "OpenAI", family: "gpt", inputPerMillion: 0.15, outputPerMillion: 0.6, contextWindow: 128_000, exact: true, charsPerToken: 4 },

  // Anthropic
  { id: "claude-opus-4.7", label: "Claude Opus 4.7", provider: "Anthropic", family: "claude", inputPerMillion: 5, outputPerMillion: 25, contextWindow: 1_000_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-opus-4.6", label: "Claude Opus 4.6", provider: "Anthropic", family: "claude", inputPerMillion: 5, outputPerMillion: 25, contextWindow: 1_000_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-sonnet-4.6", label: "Claude Sonnet 4.6", provider: "Anthropic", family: "claude", inputPerMillion: 3, outputPerMillion: 15, contextWindow: 1_000_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-sonnet-4.5", label: "Claude Sonnet 4.5", provider: "Anthropic", family: "claude", inputPerMillion: 3, outputPerMillion: 15, contextWindow: 200_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-sonnet-5", label: "Claude Sonnet 5", provider: "Anthropic", family: "claude", inputPerMillion: 2, outputPerMillion: 10, contextWindow: 1_000_000, exact: false, charsPerToken: 3.5 },
  { id: "claude-haiku-4.5", label: "Claude Haiku 4.5", provider: "Anthropic", family: "claude", inputPerMillion: 1, outputPerMillion: 5, contextWindow: 200_000, exact: false, charsPerToken: 3.5 },

  // Google
  { id: "gemini-3.1-pro", label: "Gemini 3.1 Pro", provider: "Google", family: "gemini", inputPerMillion: 2, outputPerMillion: 12, contextWindow: 1_048_576, exact: false, charsPerToken: 4 },
  { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite", provider: "Google", family: "gemini", inputPerMillion: 0.25, outputPerMillion: 1.5, contextWindow: 1_048_576, exact: false, charsPerToken: 4 },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "Google", family: "gemini", inputPerMillion: 1.25, outputPerMillion: 10, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "Google", family: "gemini", inputPerMillion: 0.15, outputPerMillion: 0.6, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", provider: "Google", family: "gemini", inputPerMillion: 0.1, outputPerMillion: 0.4, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },

  // xAI
  { id: "grok-4.6", label: "Grok 4.6", provider: "xAI", family: "grok", inputPerMillion: 2, outputPerMillion: 6, contextWindow: 500_000, exact: false, charsPerToken: 4 },
  { id: "grok-4.20", label: "Grok 4.20", provider: "xAI", family: "grok", inputPerMillion: 1.25, outputPerMillion: 2.5, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "grok-4.3", label: "Grok 4.3", provider: "xAI", family: "grok", inputPerMillion: 1.25, outputPerMillion: 2.5, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "grok-4.1-fast", label: "Grok 4.1 Fast", provider: "xAI", family: "grok", inputPerMillion: 0.2, outputPerMillion: 0.5, contextWindow: 2_000_000, exact: false, charsPerToken: 4 },

  // DeepSeek
  { id: "deepseek-v4-pro", label: "DeepSeek V4 Pro", provider: "DeepSeek", family: "deepseek", inputPerMillion: 0.435, outputPerMillion: 0.87, contextWindow: 1_000_000, exact: false, charsPerToken: 3.8 },
  { id: "deepseek-v4-flash", label: "DeepSeek V4 Flash", provider: "DeepSeek", family: "deepseek", inputPerMillion: 0.14, outputPerMillion: 0.28, contextWindow: 1_000_000, exact: false, charsPerToken: 3.8 },
  { id: "deepseek-r1", label: "DeepSeek R1", provider: "DeepSeek", family: "deepseek", inputPerMillion: 0.55, outputPerMillion: 2.19, contextWindow: 128_000, exact: false, charsPerToken: 3.8 },

  // Mistral / Meta / Alibaba
  { id: "mistral-large", label: "Mistral Large", provider: "Mistral", family: "mistral", inputPerMillion: 2, outputPerMillion: 6, contextWindow: 128_000, exact: false, charsPerToken: 3.9 },
  { id: "mistral-small", label: "Mistral Small", provider: "Mistral", family: "mistral", inputPerMillion: 0.1, outputPerMillion: 0.3, contextWindow: 128_000, exact: false, charsPerToken: 3.9 },
  { id: "llama-4-maverick", label: "Llama 4 Maverick", provider: "Meta", family: "llama", inputPerMillion: 0.27, outputPerMillion: 0.85, contextWindow: 1_000_000, exact: false, charsPerToken: 4 },
  { id: "llama-3.3-70b", label: "Llama 3.3 70B", provider: "Meta", family: "llama", inputPerMillion: 0.59, outputPerMillion: 0.79, contextWindow: 128_000, exact: false, charsPerToken: 4 },
  { id: "qwen-3-235b", label: "Qwen3 235B", provider: "Alibaba", family: "qwen", inputPerMillion: 0.2, outputPerMillion: 0.6, contextWindow: 262_144, exact: false, charsPerToken: 3.7 },
  { id: "qwen-2.5-72b", label: "Qwen 2.5 72B", provider: "Alibaba", family: "qwen", inputPerMillion: 0.35, outputPerMillion: 0.4, contextWindow: 131_072, exact: false, charsPerToken: 3.7 },
];

export const PROVIDERS = [...new Set(PRICE_MODELS.map((m) => m.provider))];
export const PROVIDER_COUNT = PROVIDERS.length;
export const DEFAULT_MODEL_ID = "gpt-5.4";

export const SAMPLE_PROMPT = `You are a senior software engineer with deep expertise in TypeScript and React. You prioritize correctness, clarity, and maintainability.

Review the following code. For each issue found:
1. State the severity (critical / major / minor)
2. Explain the problem in one sentence
3. Suggest a concrete fix

Skip praise. Be direct.

\`\`\`ts
export function fetchUser(id: string) {
  return fetch("/api/users/" + id).then((r) => r.json());
}
\`\`\``;

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "system-strict",
    name: "Strict system",
    blurb: "Role + rules + output contract",
    text: `You are {{role}}.
Follow these rules:
- Be concise
- Never invent facts
- If unsure, say so

Output format:
{{format}}`,
  },
  {
    id: "cot",
    name: "Chain-of-thought",
    blurb: "Reason then answer",
    text: `Task: {{task}}

Think step by step. Put reasoning under "Reasoning", then the final answer under "Answer".
Keep the Answer section short.`,
  },
  {
    id: "few-shot",
    name: "Few-shot",
    blurb: "Examples then query",
    text: `Classify the input.

Example 1:
Input: {{ex1_in}}
Output: {{ex1_out}}

Example 2:
Input: {{ex2_in}}
Output: {{ex2_out}}

Now classify:
Input: {{query}}
Output:`,
  },
  {
    id: "code-review",
    name: "Code review",
    blurb: "Severity-ranked findings",
    text: SAMPLE_PROMPT,
  },
  {
    id: "summarize",
    name: "Summarize",
    blurb: "Fixed-length summary",
    text: `Summarize the text below in at most {{bullets}} bullets.
No preamble. No closing remarks.

Text:
{{text}}`,
  },
  {
    id: "extract-json",
    name: "Extract JSON",
    blurb: "Schema-constrained extraction",
    text: `Extract fields into JSON matching this schema:
{{schema}}

Return JSON only.

Source:
{{source}}`,
  },
  {
    id: "rewrite",
    name: "Rewrite",
    blurb: "Tone + length control",
    text: `Rewrite the text for {{audience}} in a {{tone}} tone.
Max {{words}} words. Keep meaning. Return only the rewrite.

Text:
{{text}}`,
  },
  {
    id: "rag-qa",
    name: "RAG Q&A",
    blurb: "Answer only from chunks",
    text: `Answer using ONLY the chunks. If missing, say "Not in context."
Cite chunk ids.

Question: {{question}}

Chunks:
{{chunks}}`,
  },
  {
    id: "seo-outline",
    name: "SEO outline",
    blurb: "H2/H3 brief",
    text: `Create an outline for "{{keyword}}".
Return H2/H3 only, with one-line intent under each.`,
  },
  {
    id: "agent-tool",
    name: "Tool-using agent",
    blurb: "Plan then tool calls",
    text: `You can call tools. Decide the minimum tools needed for: {{goal}}

Return:
1) Plan (bullets)
2) Tool calls as JSON array
3) Stop condition`,
  },
  {
    id: "compress",
    name: "Compress prompt",
    blurb: "Keep intent, cut tokens",
    text: `Rewrite the instructions below to keep the same intent with fewer tokens.
Return only the compressed prompt.

Instructions:
{{text}}`,
  },
];

const FILLER_PATTERNS: { id: string; label: string; pattern: RegExp; replace: string }[] = [
  { id: "please-note", label: "Softener phrases", pattern: /\bplease\s+note\s+that\b/gi, replace: "" },
  { id: "in-order-to", label: "Wordy connectors", pattern: /\bin\s+order\s+to\b/gi, replace: "to" },
  { id: "it-is-important", label: "Padding openers", pattern: /\bit\s+is\s+(important|essential|critical)\s+to\s+(note|remember|understand)\s+that\b/gi, replace: "" },
  { id: "as-well-as", label: "Inflated conjunctions", pattern: /\bas\s+well\s+as\b/gi, replace: "and" },
  { id: "due-to-the-fact", label: "Wordy causation", pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, replace: "because" },
  { id: "at-this-point", label: "Time padding", pattern: /\bat\s+this\s+(point|moment)\s+in\s+time\b/gi, replace: "now" },
  { id: "make-sure-to", label: "Soft instructions", pattern: /\bmake\s+sure\s+to\b/gi, replace: "" },
  { id: "feel-free-to", label: "Optional fluff", pattern: /\bfeel\s+free\s+to\b/gi, replace: "" },
  { id: "i-would-like", label: "Polite padding", pattern: /\bi\s+would\s+like\s+you\s+to\b/gi, replace: "" },
  { id: "kindly", label: "Kindly fluff", pattern: /\bkindly\b/gi, replace: "" },
  { id: "in-this-regard", label: "Empty transitions", pattern: /\bin\s+this\s+regard\b/gi, replace: "" },
  { id: "it-should-be-noted", label: "Passive openers", pattern: /\bit\s+should\s+be\s+noted\s+that\b/gi, replace: "" },
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

/** Rough latency heuristic from tokens (planning only). */
export function estimateLatencyMs(inputTokens: number, outputTokens: number) {
  if (inputTokens + outputTokens === 0) return 0;
  return Math.round(180 + inputTokens * 0.35 + outputTokens * 12);
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
  if (text.length > 2500 && !/\b(only|must|never|do not)\b/i.test(text)) {
    tips.push({
      id: "constraints",
      title: "Add hard constraints",
      body: "Long prompts without must/never rules invite wandering answers and higher output tokens.",
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

export function buildFromParts(parts: {
  role: string;
  task: string;
  context: string;
  constraints: string;
  format: string;
  examples: string;
}) {
  return [
    parts.role.trim() ? `Role: ${parts.role.trim()}` : null,
    parts.task.trim() ? `Task: ${parts.task.trim()}` : null,
    parts.context.trim() ? `Context:\n${parts.context.trim()}` : null,
    parts.constraints.trim() ? `Constraints:\n${parts.constraints.trim()}` : null,
    parts.format.trim() ? `Output format:\n${parts.format.trim()}` : null,
    parts.examples.trim() ? `Examples:\n${parts.examples.trim()}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function chainToText(steps: ChainStep[]) {
  return steps
    .map(
      (step, i) =>
        `### Step ${i + 1}: ${step.name || "untitled"} (model: ${step.modelId})\n${step.prompt.trim()}`,
    )
    .join("\n\n");
}

export function measureOutputRatio(prompt: string, response: string, model: PriceModel) {
  const inTok = countTokens(prompt, model).tokens;
  const outTok = countTokens(response, model).tokens;
  const ratio = inTok > 0 ? outTok / inTok : 0;
  return { inTok, outTok, ratio };
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
const ACCUM_KEY = "fluxkit-weigh-accum-v1";
const SESSION_KEY = "fluxkit-weigh-session-v1";

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
  const next: LabHistoryItem = { ...item, id: `${Date.now()}`, savedAt: Date.now() };
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

export function loadAccumulator(): string[] {
  return readList<string>(ACCUM_KEY).slice(0, 30);
}

export function saveAccumulator(chunks: string[]) {
  writeList(ACCUM_KEY, chunks.slice(0, 30));
}

export type SessionStats = {
  prompts: number;
  tokens: number;
  cost: number;
};

export function loadSession(): SessionStats {
  if (typeof window === "undefined") return { prompts: 0, tokens: 0, cost: 0 };
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return { prompts: 0, tokens: 0, cost: 0 };
    return JSON.parse(raw) as SessionStats;
  } catch {
    return { prompts: 0, tokens: 0, cost: 0 };
  }
}

export function bumpSession(prev: SessionStats, tokens: number, cost: number): SessionStats {
  const next = {
    prompts: prev.prompts + 1,
    tokens: prev.tokens + tokens,
    cost: prev.cost + cost,
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }
  return next;
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

export function diffLines(a: string, b: string) {
  const left = a.split("\n");
  const right = b.split("\n");
  const max = Math.max(left.length, right.length);
  const rows: { left: string; right: string; changed: boolean }[] = [];
  for (let i = 0; i < max; i++) {
    const L = left[i] ?? "";
    const R = right[i] ?? "";
    rows.push({ left: L, right: R, changed: L !== R });
  }
  return rows;
}

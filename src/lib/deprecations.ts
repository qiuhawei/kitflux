export type DeprecationComplexity = "trivial" | "moderate" | "hard";
export type DeprecationUrgency = "urgent" | "soon" | "upcoming" | "retired";

export type DeprecationEntry = {
  slug: string;
  modelId: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "xAI" | "Other";
  shutdown: string; // YYYY-MM-DD
  replacement: string;
  complexity: DeprecationComplexity;
  notes: string;
  sourceUrl?: string;
};

/** Planning tracker curated for Fluxkit — verify dates on vendor docs before migrating production. */
export const DEPRECATIONS: DeprecationEntry[] = [
  {
    slug: "gemini-2-5-flash",
    modelId: "gemini-2.5-flash",
    provider: "Google",
    shutdown: "2026-10-16",
    replacement: "gemini-3-flash-preview",
    complexity: "trivial",
    notes: "Flash tier refresh. Swap model id; keep the same generateContent shape.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/models",
  },
  {
    slug: "gemini-2-5-pro",
    modelId: "gemini-2.5-pro",
    provider: "Google",
    shutdown: "2026-10-16",
    replacement: "gemini-3.1-pro-preview",
    complexity: "trivial",
    notes: "Pro tier moves to the 3.1 preview line.",
  },
  {
    slug: "gemini-2-5-flash-lite",
    modelId: "gemini-2.5-flash-lite",
    provider: "Google",
    shutdown: "2026-10-16",
    replacement: "gemini-3.1-flash-lite",
    complexity: "trivial",
    notes: "Lite cost tier rename. Update string constants and SDKs.",
  },
  {
    slug: "claude-haiku-4-5",
    modelId: "claude-haiku-4-5-20251001",
    provider: "Anthropic",
    shutdown: "2026-10-15",
    replacement: "claude-haiku-4-5 (latest alias) or newer Haiku",
    complexity: "trivial",
    notes: "Dated snapshot ids retire on a schedule. Prefer alias pins in non-prod.",
  },
  {
    slug: "gpt-4o-2024-05-13",
    modelId: "gpt-4o-2024-05-13",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-4.1",
    complexity: "trivial",
    notes: "Dated GPT-4o snapshot. Chat Completions payload stays compatible.",
  },
  {
    slug: "gpt-4-turbo",
    modelId: "gpt-4-turbo",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-4.1",
    complexity: "trivial",
    notes: "Legacy turbo id → 4.1 family.",
  },
  {
    slug: "o4-mini",
    modelId: "o4-mini",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-5-mini",
    complexity: "moderate",
    notes: "Reasoning mini line consolidates. Re-check latency and tool budgets.",
  },
  {
    slug: "o1",
    modelId: "o1",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "o3",
    complexity: "moderate",
    notes: "First-gen reasoning model. Review max_completion_tokens and tooling.",
  },
  {
    slug: "gpt-4-1-nano",
    modelId: "gpt-4.1-nano",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-5-nano",
    complexity: "trivial",
    notes: "Nano tier rename into GPT-5 nano.",
  },
  {
    slug: "gemini-2-5-flash-image",
    modelId: "gemini-2.5-flash-image",
    provider: "Google",
    shutdown: "2026-10-02",
    replacement: "gemini-3.1-flash-image-preview",
    complexity: "trivial",
    notes: "Image generation preview handoff.",
  },
  {
    slug: "claude-sonnet-4-5",
    modelId: "claude-sonnet-4-5-20250929",
    provider: "Anthropic",
    shutdown: "2026-09-29",
    replacement: "claude-sonnet-4-6",
    complexity: "trivial",
    notes: "Dated Sonnet snapshot. Messages API unchanged.",
  },
  {
    slug: "gpt-3-5-turbo-instruct",
    modelId: "gpt-3.5-turbo-instruct",
    provider: "OpenAI",
    shutdown: "2026-09-28",
    replacement: "gpt-5.4-mini",
    complexity: "moderate",
    notes: "Completions-style instruct → chat/responses. Rewrite call sites.",
  },
  {
    slug: "assistants-api",
    modelId: "Assistants API",
    provider: "OpenAI",
    shutdown: "2026-08-26",
    replacement: "Responses API + Conversations API",
    complexity: "hard",
    notes: "Platform API sunset. Threads/runs need migration, not a model string swap.",
  },
  {
    slug: "claude-opus-4-1",
    modelId: "claude-opus-4-1-20250805",
    provider: "Anthropic",
    shutdown: "2026-08-05",
    replacement: "claude-opus-4-7",
    complexity: "trivial",
    notes: "Opus dated id → current Opus.",
  },
  {
    slug: "computer-use-preview",
    modelId: "computer-use-preview",
    provider: "OpenAI",
    shutdown: "2026-07-23",
    replacement: "gpt-5.4-mini (tooling) / current computer-use GA",
    complexity: "moderate",
    notes: "Preview computer-use tooling consolidates. Re-test tool schemas.",
  },
  {
    slug: "dall-e-3",
    modelId: "dall-e-3",
    provider: "OpenAI",
    shutdown: "2026-05-12",
    replacement: "gpt-image-1",
    complexity: "moderate",
    notes: "Image API family changed. Response fields differ — update parsers.",
  },
  {
    slug: "dall-e-2",
    modelId: "dall-e-2",
    provider: "OpenAI",
    shutdown: "2026-05-12",
    replacement: "gpt-image-1",
    complexity: "moderate",
    notes: "Legacy DALL·E 2 path retired with DALL·E 3.",
  },
  {
    slug: "claude-3-haiku",
    modelId: "claude-3-haiku-20240307",
    provider: "Anthropic",
    shutdown: "2026-04-20",
    replacement: "claude-haiku-4-5-20251001",
    complexity: "trivial",
    notes: "Claude 3 Haiku → Haiku 4.5 line.",
  },
  {
    slug: "claude-3-7-sonnet",
    modelId: "claude-3-7-sonnet-20250219",
    provider: "Anthropic",
    shutdown: "2026-02-19",
    replacement: "claude-sonnet-4-6",
    complexity: "trivial",
    notes: "Already past for most regions — keep only for historical audits.",
  },
  {
    slug: "o1-mini",
    modelId: "o1-mini",
    provider: "OpenAI",
    shutdown: "2025-10-27",
    replacement: "o4-mini / gpt-5-mini",
    complexity: "trivial",
    notes: "Retired reasoning mini. Listed for migration archaeology.",
  },
];

export const DEPRECATIONS_UPDATED = "2026-09-26";

export function daysUntil(dateIso: string, from = new Date()) {
  const target = new Date(`${dateIso}T00:00:00Z`);
  const start = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const end = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
  return Math.round((end - start) / 86_400_000);
}

export function urgencyFor(entry: DeprecationEntry, from = new Date()): DeprecationUrgency {
  const days = daysUntil(entry.shutdown, from);
  if (days < 0) return "retired";
  if (days <= 30) return "urgent";
  if (days <= 60) return "soon";
  return "upcoming";
}

export function enrichDeprecation(entry: DeprecationEntry, from = new Date()) {
  const days = daysUntil(entry.shutdown, from);
  return {
    ...entry,
    daysLeft: days,
    urgency: urgencyFor(entry, from),
  };
}

export function getDeprecation(slug: string) {
  return DEPRECATIONS.find((d) => d.slug === slug);
}

export function upcomingDeprecations(from = new Date()) {
  return DEPRECATIONS.map((d) => enrichDeprecation(d, from))
    .filter((d) => d.urgency !== "retired")
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export function retiredDeprecations(from = new Date()) {
  return DEPRECATIONS.map((d) => enrichDeprecation(d, from))
    .filter((d) => d.urgency === "retired")
    .sort((a, b) => b.daysLeft - a.daysLeft);
}

export function migrationSnippets(entry: DeprecationEntry) {
  const from = entry.modelId;
  const to = entry.replacement.split(/ or | \/ |,/)[0]!.trim();
  return {
    python: {
      before: `model = "${from}"`,
      after: `model = "${to}"`,
    },
    javascript: {
      before: `const model = "${from}";`,
      after: `const model = "${to}";`,
    },
    curl: {
      before: `"model": "${from}"`,
      after: `"model": "${to}"`,
    },
  } as const;
}

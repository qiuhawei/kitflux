export type DeprecationComplexity = "trivial" | "moderate" | "hard";
export type DeprecationUrgency = "urgent" | "soon" | "upcoming" | "retired";

export type DeprecationEntry = {
  slug: string;
  modelId: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "xAI" | "Other";
  shutdown: string;
  replacement: string;
  complexity: DeprecationComplexity;
  notes: string;
  sourceUrl?: string;
};

/** Fluxkit deprecation tracker — curated for shipping migrations. Verify on vendor docs. */
export const DEPRECATIONS: DeprecationEntry[] = [
  // —— Urgent / near-term from late Sep 2026 ——
  {
    slug: "claude-sonnet-4-5",
    modelId: "claude-sonnet-4-5-20250929",
    provider: "Anthropic",
    shutdown: "2026-09-29",
    replacement: "claude-sonnet-4-6",
    complexity: "trivial",
    notes: "Dated Sonnet snapshot. Messages API shape unchanged — swap the model id.",
  },
  {
    slug: "gpt-3-5-turbo-instruct",
    modelId: "gpt-3.5-turbo-instruct",
    provider: "OpenAI",
    shutdown: "2026-09-28",
    replacement: "gpt-5.4-mini",
    complexity: "moderate",
    notes: "Instruct / completions-style traffic should move to chat or responses.",
  },
  {
    slug: "babbage-002",
    modelId: "babbage-002",
    provider: "OpenAI",
    shutdown: "2026-09-28",
    replacement: "gpt-5.4-mini",
    complexity: "moderate",
    notes: "Legacy base model. Migrate fine-tunes and completions callers.",
  },
  {
    slug: "davinci-002",
    modelId: "davinci-002",
    provider: "OpenAI",
    shutdown: "2026-09-28",
    replacement: "gpt-5.4-mini",
    complexity: "moderate",
    notes: "Legacy davinci line retirement.",
  },
  {
    slug: "gpt-3-5-turbo-1106",
    modelId: "gpt-3.5-turbo-1106",
    provider: "OpenAI",
    shutdown: "2026-09-28",
    replacement: "gpt-5.4-mini",
    complexity: "trivial",
    notes: "Dated 3.5 turbo snapshot.",
  },
  {
    slug: "sora-2",
    modelId: "sora-2",
    provider: "OpenAI",
    shutdown: "2026-09-24",
    replacement: "current Sora GA / Videos API successor",
    complexity: "hard",
    notes: "Video generation preview path. Expect API surface changes.",
  },
  {
    slug: "sora-2-pro",
    modelId: "sora-2-pro",
    provider: "OpenAI",
    shutdown: "2026-09-24",
    replacement: "current Sora GA / Videos API successor",
    complexity: "hard",
    notes: "Pro video preview retirement alongside sora-2.",
  },
  {
    slug: "videos-api",
    modelId: "Videos API",
    provider: "OpenAI",
    shutdown: "2026-09-24",
    replacement: "successor Videos API",
    complexity: "hard",
    notes: "Platform API sunset — not a simple model string swap.",
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
    slug: "claude-haiku-4-5",
    modelId: "claude-haiku-4-5-20251001",
    provider: "Anthropic",
    shutdown: "2026-10-15",
    replacement: "claude-haiku-4-5 (alias) or newer Haiku",
    complexity: "trivial",
    notes: "Dated Haiku snapshot. Prefer alias pins outside prod locks.",
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
    slug: "gemini-2-5-flash",
    modelId: "gemini-2.5-flash",
    provider: "Google",
    shutdown: "2026-10-16",
    replacement: "gemini-3-flash-preview",
    complexity: "trivial",
    notes: "Flash tier refresh. Same generateContent shape.",
  },
  {
    slug: "gemini-2-5-flash-lite",
    modelId: "gemini-2.5-flash-lite",
    provider: "Google",
    shutdown: "2026-10-16",
    replacement: "gemini-3.1-flash-lite",
    complexity: "trivial",
    notes: "Lite cost tier rename.",
  },
  {
    slug: "gpt-4o-2024-05-13",
    modelId: "gpt-4o-2024-05-13",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-4.1",
    complexity: "trivial",
    notes: "Dated GPT-4o snapshot. Chat Completions stays compatible.",
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
    slug: "gpt-4-0613",
    modelId: "gpt-4-0613",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-4.1",
    complexity: "trivial",
    notes: "Classic GPT-4 dated snapshot.",
  },
  {
    slug: "gpt-4-1106-preview",
    modelId: "gpt-4-1106-preview",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-4.1",
    complexity: "trivial",
    notes: "Preview GPT-4 turbo-era id.",
  },
  {
    slug: "gpt-3-5-turbo-0125",
    modelId: "gpt-3.5-turbo-0125",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-4.1-mini",
    complexity: "trivial",
    notes: "Dated 3.5 turbo → mini-class successor.",
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
    slug: "o1",
    modelId: "o1",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "o3",
    complexity: "moderate",
    notes: "First-gen reasoning model. Recheck token budgets and tooling.",
  },
  {
    slug: "o1-pro",
    modelId: "o1-pro",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-5.4-pro",
    complexity: "moderate",
    notes: "Pro reasoning consolidation.",
  },
  {
    slug: "o3-mini",
    modelId: "o3-mini",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "o3",
    complexity: "trivial",
    notes: "Mini reasoning → full o3 or gpt-5-mini depending on workload.",
  },
  {
    slug: "o4-mini",
    modelId: "o4-mini",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-5-mini",
    complexity: "moderate",
    notes: "Reasoning mini line consolidates into GPT-5 mini.",
  },
  {
    slug: "gpt-image-1",
    modelId: "gpt-image-1",
    provider: "OpenAI",
    shutdown: "2026-10-23",
    replacement: "gpt-image-1.5",
    complexity: "trivial",
    notes: "Image model bump — verify response fields.",
  },
  {
    slug: "claude-opus-4-5",
    modelId: "claude-opus-4-5-20251101",
    provider: "Anthropic",
    shutdown: "2026-11-24",
    replacement: "claude-opus-4-7",
    complexity: "trivial",
    notes: "Dated Opus → current Opus.",
  },
  {
    slug: "assistants-api",
    modelId: "Assistants API",
    provider: "OpenAI",
    shutdown: "2026-08-26",
    replacement: "Responses API + Conversations API",
    complexity: "hard",
    notes: "Platform API sunset. Threads/runs need a real migration.",
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
    replacement: "gpt-5.4-mini / current computer-use GA",
    complexity: "moderate",
    notes: "Preview computer-use tooling consolidates. Re-test schemas.",
  },
  {
    slug: "gpt-4o-audio-preview-2024-12-17",
    modelId: "gpt-4o-audio-preview-2024-12-17",
    provider: "OpenAI",
    shutdown: "2026-07-23",
    replacement: "gpt-audio",
    complexity: "moderate",
    notes: "Audio preview → gpt-audio family.",
  },
  {
    slug: "gpt-5-chat-latest",
    modelId: "gpt-5-chat-latest",
    provider: "OpenAI",
    shutdown: "2026-07-23",
    replacement: "gpt-5.5",
    complexity: "trivial",
    notes: "Latest alias moves forward — pin a dated id for prod.",
  },
  {
    slug: "gpt-5-codex",
    modelId: "gpt-5-codex",
    provider: "OpenAI",
    shutdown: "2026-07-23",
    replacement: "gpt-5.4",
    complexity: "trivial",
    notes: "Codex-branded id consolidates into GPT-5.4 line.",
  },
  {
    slug: "o3-deep-research",
    modelId: "o3-deep-research",
    provider: "OpenAI",
    shutdown: "2026-07-23",
    replacement: "gpt-5.4-pro",
    complexity: "moderate",
    notes: "Deep research preview path.",
  },
  {
    slug: "gemini-embedding-001",
    modelId: "gemini-embedding-001",
    provider: "Google",
    shutdown: "2026-07-14",
    replacement: "current Gemini embedding GA",
    complexity: "moderate",
    notes: "Embedding dimension / endpoint may change — re-index vectors.",
  },
  {
    slug: "claude-opus-4-20250514",
    modelId: "claude-opus-4-20250514",
    provider: "Anthropic",
    shutdown: "2026-06-15",
    replacement: "claude-opus-4-7",
    complexity: "trivial",
    notes: "Earlier Opus 4 dated snapshot.",
  },
  {
    slug: "claude-sonnet-4-20250514",
    modelId: "claude-sonnet-4-20250514",
    provider: "Anthropic",
    shutdown: "2026-06-15",
    replacement: "claude-sonnet-4-6",
    complexity: "trivial",
    notes: "Earlier Sonnet 4 dated snapshot.",
  },
  {
    slug: "gemini-2-0-flash",
    modelId: "gemini-2.0-flash",
    provider: "Google",
    shutdown: "2026-06-01",
    replacement: "gemini-2.5-flash",
    complexity: "trivial",
    notes: "2.0 Flash → 2.5 Flash (then follow the later 2.5→3.x cut).",
  },
  {
    slug: "gemini-2-0-flash-001",
    modelId: "gemini-2.0-flash-001",
    provider: "Google",
    shutdown: "2026-06-01",
    replacement: "gemini-2.5-flash",
    complexity: "trivial",
    notes: "Dated 2.0 Flash variant.",
  },
  {
    slug: "gemini-2-0-flash-lite",
    modelId: "gemini-2.0-flash-lite",
    provider: "Google",
    shutdown: "2026-06-01",
    replacement: "gemini-2.5-flash-lite",
    complexity: "trivial",
    notes: "2.0 lite → 2.5 lite.",
  },
  {
    slug: "gemini-3-1-flash-lite-preview",
    modelId: "gemini-3.1-flash-lite-preview",
    provider: "Google",
    shutdown: "2026-05-25",
    replacement: "gemini-3.1-flash-lite",
    complexity: "trivial",
    notes: "Preview → stable lite id.",
  },
  // —— Retired (historical) ——
  {
    slug: "dall-e-3",
    modelId: "dall-e-3",
    provider: "OpenAI",
    shutdown: "2026-05-12",
    replacement: "gpt-image-1",
    complexity: "moderate",
    notes: "Image API family changed. Response fields differ.",
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
    slug: "gpt-4o-realtime-preview",
    modelId: "gpt-4o-realtime-preview",
    provider: "OpenAI",
    shutdown: "2026-05-07",
    replacement: "gpt-realtime-1.5",
    complexity: "moderate",
    notes: "Realtime preview → gpt-realtime line.",
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
    notes: "Historical Sonnet 3.7 cutover.",
  },
  {
    slug: "claude-3-5-haiku",
    modelId: "claude-3-5-haiku-20241022",
    provider: "Anthropic",
    shutdown: "2026-02-19",
    replacement: "claude-haiku-4-5-20251001",
    complexity: "trivial",
    notes: "3.5 Haiku → 4.5 Haiku.",
  },
  {
    slug: "chatgpt-4o-latest",
    modelId: "chatgpt-4o-latest",
    provider: "OpenAI",
    shutdown: "2026-02-17",
    replacement: "gpt-5.1-chat-latest",
    complexity: "trivial",
    notes: "ChatGPT latest alias moved off 4o.",
  },
  {
    slug: "o1-mini",
    modelId: "o1-mini",
    provider: "OpenAI",
    shutdown: "2025-10-27",
    replacement: "o4-mini / gpt-5-mini",
    complexity: "trivial",
    notes: "Retired reasoning mini — migration archaeology.",
  },
  {
    slug: "o1-preview",
    modelId: "o1-preview",
    provider: "OpenAI",
    shutdown: "2025-07-28",
    replacement: "o3",
    complexity: "trivial",
    notes: "Early o1 preview retirement.",
  },
  {
    slug: "gpt-4-5-preview",
    modelId: "gpt-4.5-preview",
    provider: "OpenAI",
    shutdown: "2025-07-14",
    replacement: "gpt-4.1",
    complexity: "trivial",
    notes: "4.5 preview → 4.1 line.",
  },
  {
    slug: "gpt-4-32k",
    modelId: "gpt-4-32k",
    provider: "OpenAI",
    shutdown: "2025-06-06",
    replacement: "gpt-4o",
    complexity: "trivial",
    notes: "32k context GPT-4 retired.",
  },
  {
    slug: "gpt-4-vision-preview",
    modelId: "gpt-4-vision-preview",
    provider: "OpenAI",
    shutdown: "2024-12-06",
    replacement: "gpt-4o",
    complexity: "trivial",
    notes: "Vision preview folded into GPT-4o.",
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

export function allEnriched(from = new Date()) {
  return DEPRECATIONS.map((d) => enrichDeprecation(d, from)).sort((a, b) => {
    if (a.urgency === "retired" && b.urgency !== "retired") return 1;
    if (b.urgency === "retired" && a.urgency !== "retired") return -1;
    return a.daysLeft - b.daysLeft;
  });
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

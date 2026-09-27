import { PRICE_MODELS, type PriceModel } from "@/lib/aiLab";
import { CODING_AGENTS } from "@/lib/codingAgents";
import { DEPRECATIONS } from "@/lib/deprecations";
import { SYSTEM_PROMPTS, type SystemPromptEntry } from "@/lib/systemPrompts";

/** Blended sticker price assuming 3 input tokens per 1 output token. */
export function blendedPerMillion(model: PriceModel) {
  return (model.inputPerMillion * 3 + model.outputPerMillion) / 4;
}

export function formatUsd(value: number) {
  if (value >= 10) return `$${value.toFixed(2)}`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(3)}`;
}

export function modelHref(model: PriceModel) {
  return `/models/${model.id}`;
}

export function deprecationForModel(model: PriceModel) {
  const id = model.id.toLowerCase();
  return DEPRECATIONS.find((entry) => entry.modelId.toLowerCase() === id);
}

export function cheapestModels(limit = 3) {
  return [...PRICE_MODELS]
    .sort((a, b) => blendedPerMillion(a) - blendedPerMillion(b))
    .slice(0, limit);
}

export function largestContextModels(limit = 3) {
  return [...PRICE_MODELS]
    .sort((a, b) => b.contextWindow - a.contextWindow)
    .slice(0, limit);
}

export function modelsByIds(ids: string[]) {
  return ids
    .map((id) => PRICE_MODELS.find((model) => model.id === id))
    .filter((model): model is PriceModel => Boolean(model));
}

const LAB_PROVIDER: Record<string, string> = {
  OpenAI: "OpenAI",
  Anthropic: "Anthropic",
  Google: "Google",
  DeepSeek: "DeepSeek",
  Meta: "Meta",
  "Alibaba Cloud": "Alibaba",
};

export function usersOfModel(model: PriceModel): {
  prompts: SystemPromptEntry[];
  agents: { id: string; name: string; detail: string }[];
  exact: boolean;
} {
  const exactPrompts = SYSTEM_PROMPTS.filter((prompt) => prompt.weighModelLabel === model.label);
  const familyPrompts = SYSTEM_PROMPTS.filter((prompt) =>
    prompt.weighModelLabel.toLowerCase().includes(model.family),
  ).slice(0, 6);
  const agents = CODING_AGENTS.filter(
    (agent) =>
      LAB_PROVIDER[agent.lab] === model.provider ||
      agent.detail.toLowerCase().includes(model.family),
  )
    .slice(0, 4)
    .map((agent) => ({ id: agent.id, name: agent.name, detail: agent.detail }));
  return {
    prompts: exactPrompts.length > 0 ? exactPrompts.slice(0, 8) : familyPrompts,
    agents,
    exact: exactPrompts.length > 0,
  };
}

export const MODEL_SERIES = [
  { id: "gpt", label: "GPT" },
  { id: "claude", label: "Claude" },
  { id: "gemini", label: "Gemini" },
  { id: "grok", label: "Grok" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "llama", label: "Llama" },
  { id: "qwen", label: "Qwen" },
  { id: "mistral", label: "Mistral" },
] as const;

export function modelBlurb(model: PriceModel) {
  const job =
    model.inputPerMillion >= 5
      ? "frontier reasoning and hard coding tasks"
      : model.inputPerMillion <= 0.5
        ? "high-volume classification, drafts, and agent loops"
        : "everyday coding, writing, and tool use";
  return `${model.label} from ${model.provider} is priced for ${job}. Context window ${model.contextWindow.toLocaleString()} tokens. Input $${model.inputPerMillion} and output $${model.outputPerMillion} per 1M tokens.`;
}

export function formatContext(tokens: number) {
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return `${Number.isInteger(millions) ? millions.toFixed(0) : millions.toFixed(2)}M context`;
  }
  return `${Math.round(tokens / 1000)}k context`;
}

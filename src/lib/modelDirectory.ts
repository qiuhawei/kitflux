import { PRICE_MODELS, type PriceModel } from "@/lib/aiLab";
import { DEPRECATIONS } from "@/lib/deprecations";

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

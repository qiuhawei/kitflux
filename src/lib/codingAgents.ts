export type CodingAgent = {
  id: string;
  name: string;
  detail: string;
  lab: string;
  color: string;
  /** Coding Agent Index. Higher is better. */
  index: number;
  /** Average API cost per task, USD. Lower is better. */
  cost: number;
  /** Average wall time per task, minutes. Lower is better. */
  minutes: number;
  /** Millions of tokens. */
  outputM: number;
  cacheM: number;
  inputM: number;
};

export const CODING_AGENTS_UPDATED = "2026-09-27";

/** Comparison catalog transcribed from the coding-agent charts to publish on Fluxkit. */
export const CODING_AGENTS: CodingAgent[] = [
  { id: "opus-5-5", name: "Claude Code", detail: "Opus 5.5 (max)", lab: "Anthropic", color: "#c2410c", index: 66, cost: 13, minutes: 66, outputM: 3.3, cacheM: 3.1, inputM: 0.2 },
  { id: "fable-fallback", name: "Claude Code", detail: "Fable 5.1 (with fallback)", lab: "Anthropic", color: "#ea580c", index: 62, cost: 12.4, minutes: 34.8, outputM: 5.7, cacheM: 5.2, inputM: 0.3 },
  { id: "codex-astra", name: "Codex", detail: "GPT-6 Astra (max)", lab: "OpenAI", color: "#111827", index: 60, cost: 7.47, minutes: 29.4, outputM: 9.3, cacheM: 8.3, inputM: 0.4 },
  { id: "devin-fable", name: "Devin Fusion CLI", detail: "Fable 5.1 xhigh + SWE-2", lab: "Cognition", color: "#1e3a8a", index: 60, cost: 7.3, minutes: 35.8, outputM: 6.1, cacheM: 5.7, inputM: 0.4 },
  { id: "devin-astra", name: "Devin Fusion CLI", detail: "GPT-6 Astra xhigh + SWE-2", lab: "Cognition", color: "#1d4ed8", index: 60, cost: 4.54, minutes: 24.7, outputM: 9.3, cacheM: 8.5, inputM: 0.5 },
  { id: "grok-build", name: "Grok Build", detail: "Grok 4.7 (xhigh)", lab: "SpaceXAI", color: "#7c3aed", index: 56, cost: 8.82, minutes: 39.2, outputM: 14.3, cacheM: 13.6, inputM: 0.5 },
  { id: "codex-sol", name: "Codex", detail: "GPT-6 Sol (max)", lab: "OpenAI", color: "#0f172a", index: 56, cost: 2.99, minutes: 22.3, outputM: 9.8, cacheM: 9.6, inputM: 0.18 },
  { id: "muse", name: "Muse Code", detail: "Muse Spark 1.3 (max)", lab: "Meta", color: "#2563eb", index: 54, cost: 3.98, minutes: 18.4, outputM: 16.7, cacheM: 16.1, inputM: 0.4 },
  { id: "opencode", name: "Opencode", detail: "GLM-5.3", lab: "Z.ai", color: "#334155", index: 54, cost: 4.24, minutes: 48.1, outputM: 14.3, cacheM: 14, inputM: 0.3 },
  { id: "kimi", name: "Kimi Code CLI", detail: "Kimi K3", lab: "Moonshot AI", color: "#0284c7", index: 52, cost: 5.05, minutes: 60, outputM: 8.5, cacheM: 8, inputM: 0.3 },
  { id: "luna", name: "Codex", detail: "GPT-6 Luna (max)", lab: "OpenAI", color: "#64748b", index: 43, cost: 0.18, minutes: 21.4, outputM: 10.2, cacheM: 9.8, inputM: 0.2 },
  { id: "qwen", name: "Claude Code", detail: "Qwen3.8 Max", lab: "Alibaba Cloud", color: "#f97316", index: 43, cost: 3.48, minutes: 66, outputM: 5.7, cacheM: 5.7, inputM: 0.2 },
  { id: "antigravity", name: "Antigravity SDK", detail: "Gemini 3.8 Flash (high)", lab: "Google", color: "#16a34a", index: 42, cost: 2.47, minutes: 11.7, outputM: 1.5, cacheM: 14, inputM: 0.2 },
  { id: "deepseek", name: "Codex", detail: "DeepSeek V4 Pro (max)", lab: "DeepSeek", color: "#1d4ed8", index: 41, cost: 0.24, minutes: 40.3, outputM: 24.2, cacheM: 0.4, inputM: 23.9 },
];

export function formatMinutes(minutes: number) {
  if (minutes >= 60) {
    const hours = minutes / 60;
    return `${hours.toFixed(1)}h`;
  }
  return `${minutes.toFixed(1)}m`;
}

export function formatMillions(value: number) {
  return `${value.toFixed(1)}M`;
}

export function agentLabel(agent: CodingAgent) {
  return `${agent.name} · ${agent.detail}`;
}

export function paretoByCost(agents: CodingAgent[]) {
  const sorted = [...agents].sort((a, b) => a.cost - b.cost);
  let best = -Infinity;
  return sorted.filter((agent) => {
    if (agent.index > best) {
      best = agent.index;
      return true;
    }
    return false;
  });
}

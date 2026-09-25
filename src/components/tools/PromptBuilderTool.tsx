"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type Template = {
  id: string;
  name: string;
  role: string;
  task: string;
  format: string;
};

const TEMPLATES: Template[] = [
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
];

export function PromptBuilderTool() {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [topic, setTopic] = useState("JSON formatter tools for beginners");
  const [extra, setExtra] = useState("Keep the tone practical and friendly.");

  const template = TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0];

  const prompt = useMemo(() => {
    return [
      `Role: ${template.role}`,
      `Task: ${template.task}`,
      `Topic / input: ${topic.trim() || "(add your topic)"}`,
      extra.trim() ? `Constraints: ${extra.trim()}` : null,
      `Output format: ${template.format}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [template, topic, extra]);

  return (
    <div className="tool-panel">
      <div className="chip-row" role="group" aria-label="Prompt templates">
        {TEMPLATES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={templateId === item.id ? "chip chip-active" : "chip"}
            onClick={() => setTemplateId(item.id)}
            aria-pressed={templateId === item.id}
          >
            {item.name}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Topic or paste content</span>
        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={4} />
      </label>
      <label className="field">
        <span>Extra constraints (optional)</span>
        <input value={extra} onChange={(e) => setExtra(e.target.value)} />
      </label>
      <div className="tool-actions">
        <CopyButton value={prompt} label="Copy prompt" />
      </div>
      <label className="field">
        <span>Ready-to-paste prompt</span>
        <textarea value={prompt} readOnly rows={10} spellCheck={false} />
      </label>
    </div>
  );
}

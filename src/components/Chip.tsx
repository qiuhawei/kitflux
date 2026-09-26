import type { ReactNode } from "react";

type Tone =
  | "urgent"
  | "soon"
  | "upcoming"
  | "retired"
  | "trivial"
  | "moderate"
  | "hard"
  | "neutral"
  | "brand"
  | "success"
  | "violet"
  | "outline";

const toneClass: Record<Tone, string> = {
  urgent: "chip chip-urgent",
  soon: "chip chip-soon",
  upcoming: "chip chip-upcoming",
  retired: "chip chip-retired",
  trivial: "chip chip-trivial",
  moderate: "chip chip-moderate",
  hard: "chip chip-hard",
  neutral: "chip chip-neutral",
  brand: "chip chip-brand",
  success: "chip chip-success",
  violet: "chip chip-violet",
  outline: "chip chip-outline",
};

export function Chip({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`${toneClass[tone]} ${className}`.trim()}>{children}</span>;
}

export function TechniqueChip({ label, hit }: { label: string; hit: boolean }) {
  return (
    <span className={hit ? "tech-chip tech-chip-on" : "tech-chip tech-chip-off"}>
      {hit ? "✓ " : ""}
      {label}
    </span>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import {
  CODING_AGENTS,
  agentLabel,
  formatMillions,
  formatMinutes,
  paretoByCost,
  type CodingAgent,
} from "@/lib/codingAgents";

const SECTIONS = [
  { id: "highlights", label: "Highlights" },
  { id: "performance", label: "Performance" },
  { id: "token-usage", label: "Token Usage" },
  { id: "cost", label: "Cost" },
  { id: "execution-time", label: "Execution Time" },
] as const;

export function CodingAgentCharts() {
  const [tip, setTip] = useState<string | null>(null);
  const byIndex = [...CODING_AGENTS].sort((a, b) => b.index - a.index).slice(0, 8);
  const byTime = [...CODING_AGENTS].sort((a, b) => a.minutes - b.minutes).slice(0, 8);
  const byCost = [...CODING_AGENTS].sort((a, b) => a.cost - b.cost).slice(0, 8);
  const byOutput = [...CODING_AGENTS].sort(
    (a, b) => b.outputM + b.cacheM + b.inputM - (a.outputM + a.cacheM + a.inputM),
  );

  return (
    <div className="agent-layout">
      <aside className="agent-side">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </aside>
      <div className="agent-main">
        <section id="highlights">
          <h2>Highlights</h2>
          <div className="agent-highlights">
            <ChartCard
              kicker="Coding Agent Index"
              tone="violet"
              note="Higher is better"
              tip={tip}
            >
              <BarChart
                agents={byIndex}
                value={(agent) => agent.index}
                format={(agent) => String(agent.index)}
                max={70}
                onHover={setTip}
              />
            </ChartCard>
            <ChartCard kicker="Time per Task" tone="yellow" note="Lower is better" tip={tip}>
              <BarChart
                agents={byTime}
                value={(agent) => agent.minutes}
                format={(agent) => formatMinutes(agent.minutes)}
                max={70}
                onHover={setTip}
              />
            </ChartCard>
            <ChartCard kicker="Cost per Task" tone="orange" note="Lower is better" tip={tip}>
              <BarChart
                agents={byCost}
                value={(agent) => agent.cost}
                format={(agent) => `$${agent.cost.toFixed(2)}`}
                max={14}
                onHover={setTip}
              />
            </ChartCard>
          </div>
        </section>

        <section id="performance">
          <h2>Coding Agent Index vs. Cost per Task</h2>
          <p className="wx-muted">Higher index and lower cost sit in the attractive quadrant.</p>
          <ChartCard kicker="Index vs cost" tone="violet" note="Pareto line connects undominated agents" tip={tip}>
            <Scatter
              agents={CODING_AGENTS}
              x={(agent) => agent.cost}
              y={(agent) => agent.index}
              xMax={16}
              yMin={35}
              yMax={72}
              xLabel="Cost per task (USD)"
              yLabel="Coding Agent Index"
              quadrant={{ x: 8, y: 52 }}
              pareto={paretoByCost(CODING_AGENTS)}
              onHover={setTip}
            />
          </ChartCard>
        </section>

        <section id="token-usage">
          <h2>Token Usage per Task</h2>
          <p className="wx-muted">Average input, cached input, and output tokens.</p>
          <div className="agent-legend">
            <span><i style={{ background: "#f59e0b" }} /> Output</span>
            <span><i style={{ background: "#22c55e" }} /> Cached input</span>
            <span><i style={{ background: "#2563eb" }} /> Input</span>
          </div>
          <ChartCard kicker="Tokens" tone="orange" note="Cache hit rate changes effective cost" tip={tip}>
            <StackedTokens agents={byOutput} onHover={setTip} />
          </ChartCard>
        </section>

        <section id="cost">
          <h2>Cost per Task</h2>
          <p className="wx-muted">Average pay-per-token API cost. Lower is better.</p>
          <ChartCard kicker="Cost" tone="orange" note="USD per task" tip={tip}>
            <BarChart
              agents={[...CODING_AGENTS].sort((a, b) => a.cost - b.cost)}
              value={(agent) => agent.cost}
              format={(agent) => `$${agent.cost < 1 ? agent.cost.toFixed(2) : agent.cost.toFixed(2)}`}
              max={14}
              onHover={setTip}
            />
          </ChartCard>
        </section>

        <section id="execution-time">
          <h2>Time per Task</h2>
          <p className="wx-muted">Average agent wall time. Lower is better.</p>
          <ChartCard kicker="Execution time" tone="yellow" note="Active runtime" tip={tip}>
            <BarChart
              agents={[...CODING_AGENTS].sort((a, b) => a.minutes - b.minutes)}
              value={(agent) => agent.minutes}
              format={(agent) => formatMinutes(agent.minutes)}
              max={70}
              onHover={setTip}
            />
          </ChartCard>
          <ChartCard kicker="Index vs time" tone="yellow" note="Attractive quadrant is fast and high-index" tip={tip}>
            <Scatter
              agents={CODING_AGENTS}
              x={(agent) => agent.minutes}
              y={(agent) => agent.index}
              xMax={72}
              yMin={35}
              yMax={72}
              xLabel="Execution time (minutes)"
              yLabel="Coding Agent Index"
              quadrant={{ x: 30, y: 52 }}
              onHover={setTip}
            />
          </ChartCard>
        </section>
      </div>
    </div>
  );
}

function ChartCard({
  kicker,
  tone,
  note,
  tip,
  children,
}: {
  kicker: string;
  tone: "violet" | "yellow" | "orange";
  note: string;
  tip: string | null;
  children: ReactNode;
}) {
  return (
    <article className={`agent-card agent-card-${tone}`}>
      <header>
        <strong>{kicker}</strong>
        <span>{note}</span>
      </header>
      {children}
      {tip ? <p className="agent-tip">{tip}</p> : null}
    </article>
  );
}

function BarChart({
  agents,
  value,
  format,
  max,
  onHover,
}: {
  agents: CodingAgent[];
  value: (agent: CodingAgent) => number;
  format: (agent: CodingAgent) => string;
  max: number;
  onHover: (tip: string | null) => void;
}) {
  return (
    <div className="agent-bars" style={{ gridTemplateColumns: `repeat(${agents.length}, minmax(0, 1fr))` }}>
      {agents.map((agent) => {
        const pct = Math.max(4, (value(agent) / max) * 100);
        return (
          <button
            key={agent.id}
            type="button"
            className="agent-bar"
            onMouseEnter={() => onHover(`${agentLabel(agent)} (${agent.lab}) · ${format(agent)}`)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(`${agentLabel(agent)} (${agent.lab}) · ${format(agent)}`)}
            onBlur={() => onHover(null)}
          >
            <span className="agent-bar-value">{format(agent)}</span>
            <span className="agent-bar-track">
              <span style={{ height: `${pct}%`, background: agent.color }} />
            </span>
            <span className="agent-bar-name">{agent.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function StackedTokens({
  agents,
  onHover,
}: {
  agents: CodingAgent[];
  onHover: (tip: string | null) => void;
}) {
  const max = Math.max(...agents.map((agent) => agent.outputM + agent.cacheM + agent.inputM));
  return (
    <div className="agent-bars" style={{ gridTemplateColumns: `repeat(${agents.length}, minmax(0, 1fr))` }}>
      {agents.map((agent) => {
        const total = agent.outputM + agent.cacheM + agent.inputM;
        const h = (total / max) * 100;
        return (
          <button
            key={agent.id}
            type="button"
            className="agent-bar"
            onMouseEnter={() =>
              onHover(
                `${agentLabel(agent)} · output ${formatMillions(agent.outputM)}, cache ${formatMillions(agent.cacheM)}, input ${formatMillions(agent.inputM)}`,
              )
            }
            onMouseLeave={() => onHover(null)}
            onFocus={() =>
              onHover(
                `${agentLabel(agent)} · output ${formatMillions(agent.outputM)}, cache ${formatMillions(agent.cacheM)}, input ${formatMillions(agent.inputM)}`,
              )
            }
            onBlur={() => onHover(null)}
          >
            <span className="agent-bar-value">{formatMillions(total)}</span>
            <span className="agent-bar-track">
              <span className="agent-stack" style={{ height: `${h}%` }}>
                <i style={{ flex: agent.inputM, background: "#2563eb" }} />
                <i style={{ flex: agent.cacheM, background: "#22c55e" }} />
                <i style={{ flex: agent.outputM, background: "#f59e0b" }} />
              </span>
            </span>
            <span className="agent-bar-name">{agent.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function Scatter({
  agents,
  x,
  y,
  xMax,
  yMin,
  yMax,
  xLabel,
  yLabel,
  quadrant,
  pareto,
  onHover,
}: {
  agents: CodingAgent[];
  x: (agent: CodingAgent) => number;
  y: (agent: CodingAgent) => number;
  xMax: number;
  yMin: number;
  yMax: number;
  xLabel: string;
  yLabel: string;
  quadrant?: { x: number; y: number };
  pareto?: CodingAgent[];
  onHover: (tip: string | null) => void;
}) {
  const w = 640;
  const h = 320;
  const pad = { l: 44, r: 16, t: 16, b: 36 };
  const sx = (value: number) => pad.l + (value / xMax) * (w - pad.l - pad.r);
  const sy = (value: number) => pad.t + ((yMax - value) / (yMax - yMin)) * (h - pad.t - pad.b);
  const paretoLine = pareto
    ?.slice()
    .sort((a, b) => x(a) - x(b))
    .map((agent) => `${sx(x(agent))},${sy(y(agent))}`)
    .join(" ");

  return (
    <svg className="agent-scatter" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${yLabel} versus ${xLabel}`}>
      {quadrant ? (
        <rect
          x={pad.l}
          y={sy(yMax)}
          width={sx(quadrant.x) - pad.l}
          height={sy(quadrant.y) - sy(yMax)}
          className="agent-quadrant"
        />
      ) : null}
      {[0, 0.25, 0.5, 0.75, 1].map((step) => {
        const gx = pad.l + step * (w - pad.l - pad.r);
        return <line key={step} x1={gx} x2={gx} y1={pad.t} y2={h - pad.b} className="agent-grid" />;
      })}
      {paretoLine ? <polyline points={paretoLine} className="agent-pareto" /> : null}
      {agents.map((agent) => (
        <g key={agent.id}>
          <circle
            cx={sx(x(agent))}
            cy={sy(y(agent))}
            r={7}
            fill={agent.color}
            onMouseEnter={() =>
              onHover(`${agentLabel(agent)} (${agent.lab}) · index ${agent.index}`)
            }
            onMouseLeave={() => onHover(null)}
          />
        </g>
      ))}
      <text x={pad.l} y={h - 10} className="agent-axis">
        {xLabel}
      </text>
      <text x={8} y={18} className="agent-axis">
        {yLabel}
      </text>
    </svg>
  );
}

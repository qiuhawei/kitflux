import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { CodingAgentCharts } from "@/components/CodingAgentCharts";
import { CODING_AGENTS, CODING_AGENTS_UPDATED } from "@/lib/codingAgents";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coding Agents — Index, Cost, Time, and Tokens",
  description:
    "Compare RooCode, Cline, OpenHands, Aider, Continue, and other coding agents on index, cost per task, time, and token usage.",
  alternates: { canonical: absoluteUrl("/coding-agents") },
  openGraph: {
    title: `Coding Agents | ${siteConfig.name}`,
    description: "Index, cost, time, and token charts for coding agents.",
    url: absoluteUrl("/coding-agents"),
  },
};

export default function CodingAgentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Coding agent comparison",
    url: absoluteUrl("/coding-agents"),
    numberOfItems: CODING_AGENTS.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell portal-page">
        <header className="page-head">
          <div>
            <p className="eyebrow">Coding Agents</p>
            <h1>Index, cost, time, and tokens</h1>
            <p className="lede">
              {CODING_AGENTS.length} agents · updated {CODING_AGENTS_UPDATED}. Higher index is
              better. Lower cost and time are better. Weigh a real prompt in the{" "}
              <Link href="/">token counter</Link> or open the <Link href="/models">model directory</Link>.
            </p>
          </div>
        </header>
        <AdSlot format="horizontal" />
        <CodingAgentCharts />
      </div>
    </>
  );
}

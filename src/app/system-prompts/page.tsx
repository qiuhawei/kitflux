import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { SystemPromptsCatalog } from "@/components/SystemPromptsCatalog";
import { SYSTEM_PROMPTS, SYSTEM_PROMPTS_UPDATED } from "@/lib/systemPrompts";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "RooCode, Cline, Aider, OpenHands & Continue System Prompts",
  description:
    "System prompts for RooCode, Cline, Aider, OpenHands, and Continue. See token weight, techniques, and open any prompt in the free token counter.",
  keywords: [
    "roocode system prompt",
    "cline system prompt",
    "aider system prompt",
    "openhands system prompt",
    "continue.dev system prompt",
    "coding agent system prompt",
  ],
  alternates: { canonical: absoluteUrl("/system-prompts") },
  openGraph: {
    title: `System Prompts | ${siteConfig.name}`,
    description: "Inside the machine — educational system prompt reconstructions.",
    url: absoluteUrl("/system-prompts"),
  },
};

export default function SystemPromptsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI System Prompts Directory",
    url: absoluteUrl("/system-prompts"),
    description: "Educational reconstructions of production AI system-prompt patterns.",
    numberOfItems: SYSTEM_PROMPTS.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell portal-page">
        <header className="page-head" style={{ display: "block" }}>
          <p className="eyebrow">System prompts</p>
          <h1 className="wx-headline" style={{ maxWidth: "16ch", margin: "0.2rem 0 0.75rem" }}>
            Inside the <span className="wx-price"><em>machine</em></span>
          </h1>
          <p className="lede" style={{ maxWidth: "42rem" }}>
            Educational catalog of how coding agents, chat apps, and research tools instruct
            models — token weight, detected techniques, and one-click weigh. Updated{" "}
            {SYSTEM_PROMPTS_UPDATED}.
          </p>
          <div className="wx-pills" style={{ justifyContent: "flex-start", marginTop: "0.85rem" }}>
            <span>
              <strong>{SYSTEM_PROMPTS.length}</strong> tools
            </span>
            <span>
              <strong>{SYSTEM_PROMPTS.length}</strong> prompts
            </span>
            <span>
              <strong>$0</strong> API cost
            </span>
          </div>
          <div className="btn-row">
            <Link href="/system-prompts/compare" className="btn btn-primary">
              Compare two
            </Link>
            <Link href="/" className="btn btn-ghost">
              Open token counter
            </Link>
          </div>
          <section className="wx-learn" style={{ marginTop: "1.5rem" }}>
            <h2>Coding agent system prompts</h2>
            <p className="lede">
              RooCode, Cline, OpenHands, Aider, and Continue each have a catalog prompt with token
              weight and detected techniques.
            </p>
            <p>
              <Link href="/system-prompts/roocode">RooCode system prompt</Link>
              {" · "}
              <Link href="/system-prompts/cline-agent">Cline system prompt</Link>
              {" · "}
              <Link href="/system-prompts/openhands">OpenHands system prompt</Link>
              {" · "}
              <Link href="/system-prompts/aider-pair">Aider system prompt</Link>
              {" · "}
              <Link href="/system-prompts/continue-dev">Continue system prompt</Link>
            </p>
          </section>
        </header>

        <AdSlot format="horizontal" />
        <SystemPromptsCatalog />

        <section className="wx-learn" style={{ marginTop: "2.5rem" }}>
          <h2>What is a system prompt?</h2>
          <p className="lede">
            The invisible instruction layer that turns a generic LLM into a product. Read the{" "}
            <Link href="/guides">guides</Link> or weigh any prompt on the{" "}
            <Link href="/">token counter</Link>.
          </p>
        </section>
      </div>
    </>
  );
}

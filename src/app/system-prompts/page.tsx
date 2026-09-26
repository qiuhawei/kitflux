import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { SystemPromptsCatalog } from "@/components/SystemPromptsCatalog";
import { SYSTEM_PROMPTS, SYSTEM_PROMPTS_UPDATED } from "@/lib/systemPrompts";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI System Prompts Directory — Techniques, Tokens, Costs",
  description:
    "Browse educational system-prompt reconstructions from coding agents, chat assistants, and research tools. See token weight, detected techniques, and open them in the Fluxkit counter.",
  keywords: [
    "system prompt examples",
    "prompt engineering techniques",
    "cursor system prompt",
    "ai agent prompt patterns",
    "llm system prompt analysis",
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
            Educational reconstructions of how coding agents, chat apps, and research tools
            instruct models — token weight, detected techniques, and one-click weigh. Updated{" "}
            {SYSTEM_PROMPTS_UPDATED}. These are not claimed vendor leaks.
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

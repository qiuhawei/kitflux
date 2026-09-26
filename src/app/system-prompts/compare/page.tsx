import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { SystemPromptCompare } from "@/components/SystemPromptCompare";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compare System Prompts — Token & Technique Diff",
  description:
    "Compare two AI system prompts side by side: token weight, detected techniques, and cost posture.",
  alternates: { canonical: absoluteUrl("/system-prompts/compare") },
  openGraph: {
    title: `Compare System Prompts | ${siteConfig.name}`,
    url: absoluteUrl("/system-prompts/compare"),
  },
};

export default function SystemPromptComparePage() {
  return (
    <div className="shell portal-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/system-prompts">System Prompts</Link>
        <span>/</span>
        <span>Compare</span>
      </nav>
      <header className="page-head">
        <div>
          <p className="eyebrow">System prompts</p>
          <h1>Compare two</h1>
          <p className="lede">
            Token delta and technique coverage across catalog prompts. Open either in the{" "}
            <Link href="/">token counter</Link> to weigh further.
          </p>
        </div>
        <Link href="/system-prompts" className="btn btn-ghost">
          Back to directory
        </Link>
      </header>
      <AdSlot format="horizontal" />
      <SystemPromptCompare />
    </div>
  );
}

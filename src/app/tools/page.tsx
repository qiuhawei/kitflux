import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdSlot } from "@/components/AdSlot";
import { ToolsDirectory } from "@/components/ToolsDirectory";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { toolsIndexJsonLd } from "@/lib/seo";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: `Browse all ${tools.length} free browser tools on ${siteConfig.name}: JSON suite, AI token counter, prompt builder, password generator, and more.`,
  alternates: { canonical: absoluteUrl("/tools") },
};

export default function ToolsIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsIndexJsonLd()) }}
      />
      <div className="shell portal-page">
        <header className="page-head">
          <div>
            <p className="eyebrow">Directory</p>
            <h1>All tools</h1>
            <p className="lede">
              {tools.length} free browser utilities. Search or filter — open any tool in one click.
            </p>
          </div>
          <Link href="/json" className="btn btn-secondary">
            JSON studio
          </Link>
        </header>

        <AdSlot format="horizontal" />

        <Suspense fallback={<p className="lede">Loading tools…</p>}>
          <ToolsDirectory />
        </Suspense>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PRICE_MODELS, PROVIDERS } from "@/lib/aiLab";
import { SYSTEM_PROMPTS } from "@/lib/systemPrompts";
import { DEPRECATIONS } from "@/lib/deprecations";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}: private AI token counter, system prompt catalog, and model deprecation tracker.`,
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <article className="shell prose-page">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a free, private workspace to weigh AI prompts before you ship. Paste a
        draft, count tokens, compare planning cost across {PRICE_MODELS.length} models and{" "}
        {PROVIDERS.length} providers, optimize filler locally, and export API snippets — without
        uploading your text.
      </p>
      <h2>What we ship</h2>
      <ul>
        <li>
          <Link href="/">Token Counter</Link> — browser-side weighing, conversation mode, heatmap,
          and cost compare
        </li>
        <li>
          <Link href="/system-prompts">System Prompts</Link> — {SYSTEM_PROMPTS.length} catalog
          prompts with technique detection and{" "}
          <Link href="/system-prompts/compare">side-by-side compare</Link>
        </li>
        <li>
          <Link href="/deprecations">Deprecations</Link> — {DEPRECATIONS.length} tracked API model
          shutdowns with migration snippets
        </li>
        <li>
          <Link href="/compare">Model compare</Link> and <Link href="/guides">guides</Link>
        </li>
      </ul>
      <h2>Lineage</h2>
      <p>
        Catalog content and product direction continue the WeighMyPrompt lineage under Fluxkit.
        Counts and estimates still run in your browser.
      </p>
      <h2>Privacy</h2>
      <p>
        Estimates run in your browser. See the <Link href="/privacy">Privacy Policy</Link> for
        cookies and advertising details.
      </p>
      <h2>Contact</h2>
      <p>
        Email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or visit{" "}
        <Link href="/contact">contact</Link>.
      </p>
      <p>
        <Link href="/">Open the token counter →</Link>
      </p>
    </article>
  );
}

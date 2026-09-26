import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { PRICE_MODELS, PROVIDERS } from "@/lib/aiLab";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}: a private browser AI token counter and cost calculator for GPT, Claude, Gemini, DeepSeek, Grok, and more.`,
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
      <h2>What we focus on</h2>
      <p>
        One product direction: prompt weighing. Token counting, multi-model cost compare, context
        fill, optimizer tips, heatmap, versions, and share links. No JSON portal, no video
        downloaders, no kitchen-sink tool directory.
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

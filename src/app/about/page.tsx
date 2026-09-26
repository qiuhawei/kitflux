import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}: free AI tools for ChatGPT and Claude (token counter, prompt builder, cost calculator) plus JSON and developer utilities — private in your browser.`,
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  const aiCount = tools.filter((tool) => tool.category === "ai").length;

  return (
    <article className="shell prose-page">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a free toolkit for AI workflows and everyday developer jobs. Start
        with the <Link href="/ai">AI suite</Link> — token counting for ChatGPT/Claude/Gemini,
        prompt building, and API cost planning — then jump into JSON, video, and classic utilities.
        Open a page, finish the job, move on. No account required.
      </p>
      <h2>What we offer</h2>
      <p>
        The kit currently includes {tools.length} utilities, including {aiCount} AI-focused tools
        such as the <Link href="/tools/ai-token-counter">AI Token Counter</Link>,{" "}
        <Link href="/tools/prompt-builder">Prompt Builder</Link>, and{" "}
        <Link href="/tools/ai-cost-calculator">AI Cost Calculator</Link>, plus a JSON studio and
        more. For deeper workflows, start in the <Link href="/ai">AI Lab</Link> or read the{" "}
        <Link href="/guides">AI guides</Link> on tokens, API cost, and private counting.
      </p>
      <h2>Privacy by design</h2>
      <p>
        Tool input is processed in your browser with standard Web APIs. We do not require signup
        to use the utilities listed on the homepage. See our{" "}
        <Link href="/privacy">Privacy Policy</Link> for details about cookies and advertising.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about the site or a specific tool? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> or visit the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name}, a collection of free private browser tools.`,
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return (
    <article className="shell prose-page">
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a small collection of free online utilities for everyday text and
        developer tasks. The goal is simple: open a page, finish the job, and move on—without
        creating an account or uploading your content to our servers.
      </p>
      <h2>What we offer</h2>
      <p>
        The toolkit currently includes {tools.length} utilities such as a JSON formatter,
        password generator, word counter, UUID generator, Base64 converter, and more. Each tool
        page explains when to use it, how to run the steps, and answers common questions.
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

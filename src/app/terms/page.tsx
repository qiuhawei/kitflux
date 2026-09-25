import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${siteConfig.name}.`,
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <article className="shell prose-page">
      <h1>Terms of Use</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>
      <p>
        By accessing {siteConfig.name} at {siteConfig.url}, you agree to these Terms of Use. If
        you do not agree, please do not use the site.
      </p>

      <h2>Service description</h2>
      <p>
        {siteConfig.name} provides free browser-based utilities for convenience. Features may
        change, and we may add or remove tools at any time.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt, overload, or abuse the site or its infrastructure.</li>
        <li>Do not use the tools to violate applicable laws or third-party rights.</li>
        <li>Do not scrape the site in a way that harms availability for other users.</li>
      </ul>

      <h2>No warranty</h2>
      <p>
        The tools are provided “as is” without warranties of any kind. Output may contain errors.
        You are responsible for verifying results before relying on them in production systems,
        security decisions, or published content.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} is not liable for any indirect,
        incidental, or consequential damages arising from your use of the site or tool output.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how information is handled,
        including advertising cookies when ads are enabled.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </article>
  );
}

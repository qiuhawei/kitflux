import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <article className="shell prose-page">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0, 10)}</p>
      <p>
        This Privacy Policy explains how {siteConfig.name} (“we”, “us”) handles information when
        you use {siteConfig.url}. By using the site, you agree to this policy.
      </p>

      <h2>Information we process in your browser</h2>
      <p>
        The Fluxkit token counter, cost calculator, optimizer, versions, and history run locally in
        your browser. Prompt text you paste is not uploaded to our servers for tokenization or cost
        estimates as part of normal operation. Share links keep drafts in the URL fragment.
      </p>

      <h2>Information we may collect</h2>
      <ul>
        <li>
          <strong>Server logs:</strong> hosting providers may record standard request data such as
          IP address, browser type, and pages visited for security and reliability.
        </li>
        <li>
          <strong>Contact email:</strong> if you email us, we receive the address and message
          content you send so we can respond.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> if advertising or analytics partners
          are enabled, they may set cookies as described below.
        </li>
      </ul>

      <h2>Advertising</h2>
      <p>
        We may display ads served by Google AdSense or similar partners. Google and its partners
        may use cookies or device identifiers to show ads based on your visits to this site and
        other sites. You can learn more and manage ad settings at{" "}
        <a href="https://policies.google.com/technologies/ads" rel="noreferrer">
          Google Ads Settings
        </a>{" "}
        and{" "}
        <a href="https://policies.google.com/privacy" rel="noreferrer">
          Google Privacy Policy
        </a>
        .
      </p>

      <h2>Children’s privacy</h2>
      <p>
        This site is not directed at children under 13 (or the equivalent minimum age in your
        region). We do not knowingly collect personal information from children.
      </p>

      <h2>Your choices</h2>
      <p>
        You can block cookies in your browser settings. Blocking cookies may affect ad
        personalization and some third-party features. You may also contact us to ask questions
        about this policy.
      </p>

      <h2>Contact</h2>
      <p>
        Email:{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
        <br />
        Or use our <Link href="/contact">contact page</Link>.
      </p>
    </article>
  );
}

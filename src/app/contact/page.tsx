import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${siteConfig.name} for questions about our free online tools.`,
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <article className="shell prose-page">
      <h1>Contact</h1>
      <p>
        Need help with a tool, found a bug, or have a privacy question? Reach us by email. We
        read every message and typically reply within a few business days.
      </p>
      <p>
        <strong>Email:</strong>{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
      <p>
        Please include the tool name and a short description of the issue. Do not send passwords,
        private keys, or other secrets in email.
      </p>
      <p>
        Site: <a href={siteConfig.url}>{siteConfig.url}</a>
      </p>
    </article>
  );
}

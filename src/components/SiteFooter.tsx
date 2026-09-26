import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

const popular = [
  "ai-lab",
  "prompt-optimizer",
  "model-pricing",
  "ai-token-counter",
  "json-formatter",
];

export function SiteFooter() {
  const popularTools = popular
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">{siteConfig.name}</p>
          <p className="footer-copy">
            Free AI tools for ChatGPT &amp; Claude — plus JSON, video, and everyday utilities.
            Private by design.
          </p>
        </div>
        <div>
          <p className="footer-label">Popular</p>
          <ul>
            {popularTools.map((tool) =>
              tool ? (
                <li key={tool.slug}>
                  <Link
                    href={
                      tool.slug === "json-formatter"
                        ? "/json"
                        : tool.slug === "ai-lab"
                          ? "/ai"
                          : tool.slug === "model-pricing"
                            ? "/models"
                            : `/tools/${tool.slug}`
                    }
                  >
                    {tool.shortName}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>
        <div>
          <p className="footer-label">Site</p>
          <ul>
            <li>
              <Link href="/ai">AI Lab</Link>
            </li>
            <li>
              <Link href="/models">Model pricing</Link>
            </li>
            <li>
              <Link href="/guides">Guides</Link>
            </li>
            <li>
              <Link href="/json">JSON studio</Link>
            </li>
            <li>
              <Link href="/video">Video tools</Link>
            </li>
            <li>
              <Link href="/tools">All tools</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

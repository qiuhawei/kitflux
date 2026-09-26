import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">{siteConfig.name}</p>
          <p className="footer-copy">
            Private AI token counter and cost calculator. Weigh prompts before you ship — in your
            browser.
          </p>
        </div>
        <div>
          <p className="footer-label">Product</p>
          <ul>
            <li>
              <Link href="/">Token Counter</Link>
            </li>
            <li>
              <Link href="/system-prompts">System Prompts</Link>
            </li>
            <li>
              <Link href="/compare">Model Compare</Link>
            </li>
            <li>
              <Link href="/deprecations">Deprecations</Link>
            </li>
            <li>
              <Link href="/guides">Guides</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="footer-label">Site</p>
          <ul>
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
    </footer>
  );
}

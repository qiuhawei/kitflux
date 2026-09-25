import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">{siteConfig.name}</p>
          <p className="footer-copy">
            Free browser tools. Private by design. Built for speed.
          </p>
        </div>
        <div>
          <p className="footer-label">Popular</p>
          <ul>
            {tools.slice(0, 5).map((tool) => (
              <li key={tool.slug}>
                <Link href={`/tools/${tool.slug}`}>{tool.shortName}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="footer-label">Site</p>
          <ul>
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
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

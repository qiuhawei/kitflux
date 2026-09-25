import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { homeJsonLd } from "@/lib/seo";
import { categories, tools } from "@/lib/tools";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />

      <section className="hero">
        <div className="shell">
          <div className="hero-copy">
            <p className="hero-brand">Fluxkit</p>
            <h1>Free tools that load fast and stay private.</h1>
            <p className="lede">
              Format JSON, generate passwords, count words, and more — all in your browser.
              No account. No upload.
            </p>
            <div className="hero-actions">
              <Link href="/#tools" className="btn btn-primary">
                Browse tools
              </Link>
              <Link href="/tools/json-formatter" className="btn btn-secondary">
                Open JSON Formatter
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden>
            <div className="hero-visual-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-visual-body">
              <pre className="hero-code">{`{
  "tool": "json-formatter",
  "private": true,
  "upload": false
}`}</pre>
              <div className="hero-preview">
                <strong>Works in your browser</strong>
                Paste data, get a result instantly. Nothing is sent to our servers for these
                utilities.
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="shell">
        <AdSlot format="horizontal" />
      </div>

      <section className="section" id="tools">
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Everyday tools, ready when you need them</h2>
              <p>
                Each utility includes clear instructions, tips, and answers so you can solve a
                task without leaving the page.
              </p>
            </div>
          </div>

          <div className="tool-grid">
            {tools.map((tool) => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card">
                <span className="cat">{categories[tool.category].label}</span>
                <strong>{tool.shortName}</strong>
                <span>{tool.description}</span>
                <span className="go">Open tool →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

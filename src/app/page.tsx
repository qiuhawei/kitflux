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
            <h1>Free online tools that load fast and stay private.</h1>
            <p className="lede">
              JSON formatter, password generator, word counter, Base64, UUID, and more — all in
              your browser. No account. No upload.
            </p>
            <div className="hero-actions">
              <Link href="/tools" className="btn btn-primary">
                Browse all tools
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
              <h2>Popular free tools</h2>
              <p>
                Built for quick jobs developers and writers do every day.{" "}
                <Link href="/tools">See the full directory →</Link>
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

      <section className="section why-section">
        <div className="shell prose-narrow">
          <h2>Why people use Fluxkit</h2>
          <p>
            Most online utilities either require an account or send your paste to a server. Fluxkit
            tools are designed to finish the task in the browser: format JSON, generate a password,
            count words, encode Base64, or mint UUIDs without creating yet another login.
          </p>
          <p>
            Each tool page includes steps, tips, and FAQs so you can use it immediately — and so
            search engines can understand what the page is for. Start with the{" "}
            <Link href="/tools/json-formatter">JSON Formatter</Link>,{" "}
            <Link href="/tools/password-generator">Password Generator</Link>, or browse{" "}
            <Link href="/tools">all tools</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

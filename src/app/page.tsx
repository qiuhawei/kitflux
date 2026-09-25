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
            <h1>Free AI & developer tools that stay private.</h1>
            <p className="lede">
              Count AI tokens, build better prompts, estimate API cost, format JSON, and more —
              all in your browser. No account. No upload.
            </p>
            <div className="hero-actions">
              <Link href="/tools" className="btn btn-primary">
                Browse all tools
              </Link>
              <Link href="/tools/ai-token-counter" className="btn btn-secondary">
                Open AI Token Counter
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
          <h2>Built for AI workflows — without the AI markup</h2>
          <p>
            Chat apps are crowded. Fluxkit focuses on the utilities around them: estimate tokens
            before you hit a limit, assemble a clear prompt, and budget API spend. Classic
            developer tools like JSON formatting stay one click away.
          </p>
          <p>
            Everything runs locally in your browser. Start with the{" "}
            <Link href="/tools/ai-token-counter">AI Token Counter</Link>,{" "}
            <Link href="/tools/prompt-builder">Prompt Builder</Link>, or{" "}
            <Link href="/tools/ai-cost-calculator">AI Cost Calculator</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

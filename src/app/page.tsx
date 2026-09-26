import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomePortal } from "@/components/HomePortal";
import { PortalGrid } from "@/components/PortalGrid";
import { homeJsonLd } from "@/lib/seo";
import { getTool, tools } from "@/lib/tools";

export default function HomePage() {
  const aiLab = getTool("ai-lab");
  const aiTools = tools.filter((tool) => tool.category === "ai");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />

      <section className="home-intro">
        <div className="shell home-intro-inner">
          <div className="home-intro-copy">
            <p className="home-kicker">Differentiated · Private · In-browser</p>
            <h1 className="home-brand">Fluxkit</h1>
            <p className="home-lede">
              Not another clone counter. <strong>AI Lab</strong> drafts prompts, compares GPT /
              Claude / Gemini tokens, and estimates API cost in one private workspace — plus JSON
              &amp; video utilities.
            </p>
          </div>
          <div className="home-intro-actions">
            <Link href="/ai" className="btn btn-primary">
              Open AI Lab
            </Link>
            <Link href="/guides" className="btn btn-secondary">
              SEO guides
            </Link>
          </div>
        </div>
      </section>

      <section className="diff-strip">
        <div className="shell diff-strip-grid">
          <div>
            <strong>Workflow, not widgets</strong>
            <p>Prompt → multi-model tokens → cost in one screen.</p>
          </div>
          <div>
            <strong>Share without upload</strong>
            <p>Send drafts via <code>#prompt=</code> hash links.</p>
          </div>
          <div>
            <strong>Guides that rank</strong>
            <p>
              Long-tail articles that funnel into the{" "}
              <Link href="/ai">Lab</Link>.
            </p>
          </div>
        </div>
      </section>

      <div className="shell" id="tools">
        <section className="portal-section featured-ai">
          <div className="portal-section-head">
            <h2>Start with AI Lab</h2>
            <p>
              <Link href="/ai">Full workspace →</Link>
            </p>
          </div>
          {aiLab ? (
            <PortalGrid tools={[aiLab, ...aiTools.filter((t) => t.slug !== "ai-lab")]} />
          ) : (
            <PortalGrid tools={aiTools} />
          )}
        </section>

        <AdSlot format="horizontal" />
        <HomePortal />
      </div>
    </>
  );
}

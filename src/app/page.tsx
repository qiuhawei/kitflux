import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomePortal } from "@/components/HomePortal";
import { PortalGrid } from "@/components/PortalGrid";
import { homeJsonLd } from "@/lib/seo";
import { tools } from "@/lib/tools";

export default function HomePage() {
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
            <p className="home-kicker">Free AI · Private · In-browser</p>
            <h1 className="home-brand">Fluxkit</h1>
            <p className="home-lede">
              ChatGPT token counter, prompt builder, API cost calculator, plus JSON &amp; video
              utilities — {tools.length} tools, nothing uploaded.
            </p>
          </div>
          <div className="home-intro-actions">
            <Link href="/ai" className="btn btn-primary">
              AI tools
            </Link>
            <Link href="/tools/ai-token-counter" className="btn btn-secondary">
              Token counter
            </Link>
          </div>
        </div>
      </section>

      <div className="shell" id="tools">
        <section className="portal-section featured-ai">
          <div className="portal-section-head">
            <h2>Featured AI tools</h2>
            <p>
              <Link href="/ai">See the full AI suite →</Link>
            </p>
          </div>
          <PortalGrid tools={aiTools} />
        </section>

        <AdSlot format="horizontal" />
        <HomePortal />
      </div>
    </>
  );
}

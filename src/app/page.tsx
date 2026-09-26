import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomePortal } from "@/components/HomePortal";
import { homeJsonLd } from "@/lib/seo";
import { tools } from "@/lib/tools";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()) }}
      />

      <section className="home-intro">
        <div className="shell home-intro-inner">
          <div className="home-intro-copy">
            <p className="home-kicker">Free · Private · In-browser</p>
            <h1 className="home-brand">Fluxkit</h1>
            <p className="home-lede">
              {tools.length} developer &amp; AI utilities. Pick a tool — nothing is uploaded.
            </p>
          </div>
          <div className="home-intro-actions">
            <Link href="/json" className="btn btn-primary">
              JSON studio
            </Link>
            <Link href="/video" className="btn btn-secondary">
              Video tools
            </Link>
          </div>
        </div>
      </section>

      <div className="shell" id="tools">
        <AdSlot format="horizontal" />
        <HomePortal />
      </div>
    </>
  );
}

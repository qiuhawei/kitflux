import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Chip } from "@/components/Chip";
import {
  DEPRECATIONS,
  DEPRECATIONS_UPDATED,
  allEnriched,
  upcomingDeprecations,
  retiredDeprecations,
} from "@/lib/deprecations";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Model Deprecations Tracker — Shutdown Dates & Migrations",
  description:
    "Track upcoming OpenAI, Anthropic, and Google model shutdowns. See days left, replacements, complexity, and copy-paste migration snippets.",
  keywords: [
    "ai model deprecation",
    "openai model shutdown",
    "gemini deprecated models",
    "claude model retirement",
    "api migration guide",
  ],
  alternates: { canonical: absoluteUrl("/deprecations") },
  openGraph: {
    title: `Deprecations | ${siteConfig.name}`,
    description: "Upcoming AI API model shutdowns with migration replacements.",
    url: absoluteUrl("/deprecations"),
  },
};

export default function DeprecationsPage() {
  const upcoming = upcomingDeprecations();
  const retired = retiredDeprecations();
  const catalog = allEnriched();
  const urgent = upcoming.filter((d) => d.urgency === "urgent").length;
  const soon = upcoming.filter((d) => d.urgency === "soon").length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Model Deprecations Tracker",
    url: absoluteUrl("/deprecations"),
    description: "Upcoming and retired AI API model shutdown dates with replacements.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell portal-page">
        <header className="page-head">
          <div>
            <p className="eyebrow">Deprecations</p>
            <h1>AI API model deprecations</h1>
            <p className="lede">
              Track when OpenAI, Anthropic, and Google retire API model ids. Each card shows
              shutdown date, days left, replacement, and a quick migration snippet. Catalog updated{" "}
              {DEPRECATIONS_UPDATED}. Always confirm on vendor docs before production cuts.
            </p>
          </div>
          <Link href="/" className="btn btn-primary">
            Weigh a prompt
          </Link>
        </header>

        <div className="wx-pills" style={{ justifyContent: "flex-start", marginBottom: "1.25rem" }}>
          <span>
            <strong>{upcoming.length}</strong> upcoming
          </span>
          <span>
            <strong>{retired.length}</strong> retired
          </span>
          <span>
            <strong>{urgent}</strong> within 30 days
          </span>
          <span>
            <strong>{soon}</strong> within 60 days
          </span>
          <span>
            <strong>{DEPRECATIONS.length}</strong> tracked
          </span>
        </div>

        <AdSlot format="horizontal" />

        <section className="wx-learn">
          <h2>Upcoming shutdowns</h2>
          <div className="catalog-grid">
            {upcoming.map((item) => (
              <Link
                key={item.slug}
                href={`/deprecations/${item.slug}`}
                className={`catalog-card ${item.urgency === "urgent" ? "catalog-card-urgent" : ""}`}
              >
                <div className="catalog-card-head">
                  <Chip tone="neutral">{item.provider}</Chip>
                  <Chip
                    tone={
                      item.urgency === "urgent"
                        ? "urgent"
                        : item.urgency === "soon"
                          ? "soon"
                          : "upcoming"
                    }
                  >
                    {item.urgency}
                  </Chip>
                </div>
                <h3>{item.modelId}</h3>
                <div className="catalog-meta">
                  <div>
                    <span>Shutdown</span>
                    <strong>{item.shutdown}</strong>
                  </div>
                  <div>
                    <span>Days left</span>
                    <strong>{item.daysLeft}</strong>
                  </div>
                  <div>
                    <span>Complexity</span>
                    <strong>
                      <Chip tone={item.complexity}>{item.complexity}</Chip>
                    </strong>
                  </div>
                  <div>
                    <span>Replace with</span>
                    <strong style={{ fontSize: "0.82rem" }}>{item.replacement}</strong>
                  </div>
                </div>
                <span className="wx-linkish">See migration →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="wx-learn">
          <h2>Full catalog</h2>
          <p className="lede">Every tracked model id — sort by shutdown date, open a row for migration snippets.</p>
          <div className="model-table-wrap">
            <table className="model-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Shutdown</th>
                  <th>Days</th>
                  <th>Complexity</th>
                  <th>Replacement</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link href={`/deprecations/${item.slug}`}>{item.modelId}</Link>
                    </td>
                    <td>{item.provider}</td>
                    <td>
                      <Chip
                        tone={
                          item.urgency === "urgent"
                            ? "urgent"
                            : item.urgency === "soon"
                              ? "soon"
                              : item.urgency === "upcoming"
                                ? "upcoming"
                                : "retired"
                        }
                      >
                        {item.urgency}
                      </Chip>
                    </td>
                    <td>{item.shutdown}</td>
                    <td>{item.daysLeft}</td>
                    <td>
                      <Chip tone={item.complexity}>{item.complexity}</Chip>
                    </td>
                    <td>{item.replacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="wx-learn">
          <h2>Already retired</h2>
          <div className="model-table-wrap">
            <table className="model-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Provider</th>
                  <th>Shutdown</th>
                  <th>Replacement</th>
                </tr>
              </thead>
              <tbody>
                {retired.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link href={`/deprecations/${item.slug}`}>{item.modelId}</Link>
                    </td>
                    <td>{item.provider}</td>
                    <td>
                      <Chip tone="retired">Retired</Chip> {item.shutdown}
                    </td>
                    <td>{item.replacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="wx-learn">
          <h2>Will this migration cost more?</h2>
          <p className="lede">
            Switching replacements can change spend 25–85% depending on token mix.{" "}
            <Link href="/">Weigh your real prompt</Link> or open{" "}
            <Link href="/compare">model compare</Link>.
          </p>
        </section>
      </div>
    </>
  );
}

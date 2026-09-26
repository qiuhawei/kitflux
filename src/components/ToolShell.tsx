import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools";
import { getGuidesForTool } from "@/lib/guides";
import { categories, getRelatedTools } from "@/lib/tools";
import { AdSlot } from "@/components/AdSlot";
import { ShareButton } from "@/components/ShareButton";

type ToolShellProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

export function ToolShell({ tool, children }: ToolShellProps) {
  const related = getRelatedTools(tool.slug);
  const relatedGuides = getGuidesForTool(tool.slug);
  const immersive = tool.slug === "json-formatter" || tool.slug === "ai-lab";

  return (
    <div className={immersive ? "tool-page tool-page-immersive" : "tool-page"}>
      <div className="shell tool-layout">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/tools">Tools</Link>
          <span>/</span>
          <span>{tool.shortName}</span>
        </nav>

        <header className="tool-header">
          <p className="eyebrow">{categories[tool.category].label}</p>
          <h1>{tool.name}</h1>
          <p className="lede">{tool.description}</p>
          <div className="tool-actions header-actions">
            <ShareButton title={tool.name} />
            {tool.category === "ai" ? (
              <Link href="/ai" className="btn btn-secondary">
                Open AI Lab
              </Link>
            ) : (
              <Link href="/json" className="btn btn-secondary">
                Open JSON studio
              </Link>
            )}
            <Link href="/tools" className="btn btn-ghost">
              All tools
            </Link>
          </div>
        </header>

        <AdSlot className="ad-top" format="horizontal" />

        <section className="tool-workspace tool-workspace-wide" aria-label={tool.name}>
          {children}
        </section>

        <AdSlot className="ad-mid" format="rectangle" />

        {!immersive ? (
          <>
            <section className="guide-block">
              <h2>{tool.guide.heading}</h2>
              <p>{tool.guide.intro}</p>
              <h3>Steps</h3>
              <ol>
                {tool.guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h3>Tips</h3>
              <ul>
                {tool.guide.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>

            <section className="faq-block">
              <h2>Frequently asked questions</h2>
              <div className="faq-list">
                {tool.faq.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="guide-block">
            <h2>{tool.guide.heading}</h2>
            <p>{tool.guide.intro}</p>
            <p>
              Prefer a distraction-free layout? Use the{" "}
              <Link href="/json">JSON studio</Link> or add <code>?fullscreen=1</code>.
            </p>
          </section>
        )}

        {relatedGuides.length > 0 ? (
          <section className="related-block">
            <h2>Guides that deepen this tool</h2>
            <div className="related-grid">
              {relatedGuides.map((guide) => (
                <Link key={guide.slug} href={`/guides/${guide.slug}`} className="related-card">
                  <strong>{guide.title}</strong>
                  <span>{guide.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="related-block">
          <h2>Related tools</h2>
          <div className="related-grid">
            {related.map((item) => (
              <Link key={item.slug} href={`/tools/${item.slug}`} className="related-card">
                <strong>{item.shortName}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

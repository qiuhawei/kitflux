import Link from "next/link";
import type { ToolDefinition } from "@/lib/tools";
import { getRelatedTools } from "@/lib/tools";
import { AdSlot } from "@/components/AdSlot";

type ToolShellProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

export function ToolShell({ tool, children }: ToolShellProps) {
  const related = getRelatedTools(tool.slug);

  return (
    <div className="tool-page">
      <div className="shell tool-layout">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#tools">Tools</Link>
          <span>/</span>
          <span>{tool.shortName}</span>
        </nav>

        <header className="tool-header">
          <p className="eyebrow">{tool.category}</p>
          <h1>{tool.name}</h1>
          <p className="lede">{tool.description}</p>
        </header>

        <AdSlot className="ad-top" format="horizontal" />

        <section className="tool-workspace" aria-label={tool.name}>
          {children}
        </section>

        <AdSlot className="ad-mid" format="rectangle" />

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

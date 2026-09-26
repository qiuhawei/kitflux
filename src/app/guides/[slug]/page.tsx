import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { getGuide, guides } from "@/lib/guides";

type Props = PageProps<"/guides/[slug]">;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      siteName: siteConfig.name,
      type: "article",
    },
  };
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        dateModified: guide.updated,
        author: { "@type": "Organization", name: siteConfig.name },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.title,
            item: absoluteUrl(`/guides/${guide.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="shell guide-article">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/guides">Guides</Link>
          <span>/</span>
          <span>{guide.title}</span>
        </nav>

        <header className="guide-article-head">
          <p className="eyebrow">Guide · {guide.readingMinutes} min</p>
          <h1>{guide.title}</h1>
          <p className="lede">{guide.description}</p>
          <p className="guide-meta">Updated {guide.updated}</p>
          <div className="wx-actions" style={{ marginTop: "0.85rem" }}>
            <Link href="/" className="btn btn-primary">
              Open token counter
            </Link>
            <Link href="/compare" className="btn btn-secondary">
              Compare models
            </Link>
          </div>
        </header>

        <AdSlot format="horizontal" />

        {guide.sections.map((section) => (
          <section key={section.heading} className="guide-section">
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="guide-section">
          <h2>FAQ</h2>
          <div className="faq-list">
            {guide.faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="portal-foot">
          <Link href="/guides">All guides</Link>
          {" · "}
          <Link href="/">Token counter</Link>
          {" · "}
          <Link href="/compare">Compare</Link>
        </p>
      </article>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolShell } from "@/components/ToolShell";
import { renderTool } from "@/components/tools/registry";
import { buildToolMetadata, toolJsonLd } from "@/lib/seo";
import { getTool, tools } from "@/lib/tools";

type Props = PageProps<"/tools/[slug]">;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return buildToolMetadata(tool);
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  const body = renderTool(slug);

  if (!tool || !body) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd(tool)) }}
      />
      <ToolShell tool={tool}>{body}</ToolShell>
    </>
  );
}

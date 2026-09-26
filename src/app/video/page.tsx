import type { Metadata } from "next";
import Link from "next/link";
import { PortalGrid } from "@/components/PortalGrid";
import { AdSlot } from "@/components/AdSlot";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Video Tools — YouTube Thumbnail, TikTok Cover & More",
  description:
    "Free video utilities: YouTube thumbnail downloader, YouTube embed generator, TikTok cover & info, Vimeo thumbnails, URL parser, and local video file info. No unauthorized stream rippers.",
  keywords: [
    "youtube thumbnail downloader",
    "tiktok cover",
    "youtube embed generator",
    "video tools",
    "vimeo thumbnail",
  ],
  alternates: { canonical: absoluteUrl("/video") },
  openGraph: {
    title: `Video Tools | ${siteConfig.name}`,
    description:
      "YouTube thumbnails, TikTok covers, embeds, and local file info — AdSense-safe video utilities.",
    url: absoluteUrl("/video"),
  },
};

export default function VideoHubPage() {
  const videoTools = tools.filter((tool) => tool.category === "video");

  return (
    <div className="shell portal-page">
      <header className="portal-header">
        <div>
          <p className="eyebrow">Video suite</p>
          <h1>Video tools</h1>
          <p className="lede">
            {videoTools.length} free utilities for covers, embeds, and files you already own.
            We do <strong>not</strong> offer YouTube/TikTok MP4 rippers — those violate platform
            terms and risk AdSense rejection.
          </p>
        </div>
        <Link href="/tools?cat=video" className="btn btn-secondary">
          All video tools
        </Link>
      </header>

      <AdSlot format="horizontal" />

      <section className="portal-section">
        <div className="portal-section-head">
          <h2>Video tools</h2>
          <p>Thumbnails, embeds, URL parsing, and local inspection.</p>
        </div>
        <PortalGrid tools={videoTools} />
      </section>

      <article className="prose-narrow">
        <h2>What these tools are for</h2>
        <ul>
          <li>Download public YouTube / Vimeo / TikTok cover images</li>
          <li>Generate official YouTube embed codes</li>
          <li>Parse IDs from YouTube, TikTok, Vimeo, and Bilibili links</li>
          <li>Inspect duration and resolution of videos already on your device</li>
        </ul>
        <p>
          Need JSON utilities instead? Open the{" "}
          <Link href="/json">JSON studio</Link> or browse{" "}
          <Link href="/tools">all tools</Link>.
        </p>
      </article>
    </div>
  );
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_HOSTS = [
  "tiktok.com",
  "www.tiktok.com",
  "vm.tiktok.com",
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "m.youtube.com",
];

function isAllowed(url: URL) {
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol) || !isAllowed(target)) {
    return NextResponse.json({ error: "URL host not allowed" }, { status: 400 });
  }

  const endpoint = `https://www.tiktok.com/oembed?url=${encodeURIComponent(target.toString())}`;
  const vimeoEndpoint = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(target.toString())}`;
  const youtubeEndpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(target.toString())}&format=json`;

  const host = target.hostname.replace(/^www\./, "");
  const fetchUrl = host.includes("tiktok")
    ? endpoint
    : host.includes("vimeo")
      ? vimeoEndpoint
      : host.includes("youtube") || host === "youtu.be"
        ? youtubeEndpoint
        : null;

  if (!fetchUrl) {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  }

  try {
    const res = await fetch(fetchUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Provider returned ${res.status}. Check the link is public.` },
        { status: 502 },
      );
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}

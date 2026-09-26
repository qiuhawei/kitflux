export type VideoPlatform = "youtube" | "tiktok" | "vimeo" | "bilibili" | "unknown";

export type ParsedVideoUrl = {
  platform: VideoPlatform;
  id: string | null;
  url: string;
  watchUrl: string | null;
};

function cleanUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Paste a video URL first");
  try {
    return new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    throw new Error("That does not look like a valid URL");
  }
}

export function extractYouTubeId(input: string): string {
  const url = cleanUrl(input);
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id) return id.slice(0, 11);
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
    const v = url.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") {
      if (parts[1]) return parts[1].slice(0, 11);
    }
  }

  const bare = input.trim().match(/^[a-zA-Z0-9_-]{11}$/);
  if (bare) return bare[0];

  throw new Error("Could not find a YouTube video ID in that link");
}

export function youtubeThumbnails(id: string) {
  const base = `https://i.ytimg.com/vi/${id}`;
  return [
    { label: "Max resolution", quality: "maxresdefault", url: `${base}/maxresdefault.jpg` },
    { label: "Standard (HQ)", quality: "hqdefault", url: `${base}/hqdefault.jpg` },
    { label: "Medium", quality: "mqdefault", url: `${base}/mqdefault.jpg` },
    { label: "Default", quality: "default", url: `${base}/default.jpg` },
    { label: "Frame 1", quality: "1", url: `${base}/1.jpg` },
    { label: "Frame 2", quality: "2", url: `${base}/2.jpg` },
    { label: "Frame 3", quality: "3", url: `${base}/3.jpg` },
  ];
}

export function extractVimeoId(input: string): string {
  const url = cleanUrl(input);
  const host = url.hostname.replace(/^www\./, "");
  if (!host.endsWith("vimeo.com")) throw new Error("Not a Vimeo URL");
  const match = url.pathname.match(/\/(?:video\/)?(\d+)/);
  if (!match) throw new Error("Could not find a Vimeo video ID");
  return match[1];
}

export function extractTikTokPath(input: string): string {
  const url = cleanUrl(input);
  const host = url.hostname.replace(/^www\./, "");
  if (!host.includes("tiktok.com") && host !== "vm.tiktok.com") {
    throw new Error("Not a TikTok URL");
  }
  return url.toString();
}

export function extractBilibiliId(input: string): string {
  const url = cleanUrl(input);
  const host = url.hostname.replace(/^www\./, "");
  if (!host.includes("bilibili.com") && host !== "b23.tv") {
    throw new Error("Not a Bilibili URL");
  }
  const bv = url.pathname.match(/\/video\/(BV[\w]+)/i);
  if (bv) return bv[1];
  const av = url.pathname.match(/\/video\/(av\d+)/i);
  if (av) return av[1];
  throw new Error("Could not find a Bilibili video id (BV/av)");
}

export function parseVideoUrl(input: string): ParsedVideoUrl {
  const trimmed = input.trim();
  const url = cleanUrl(trimmed);
  const host = url.hostname.replace(/^www\./, "");

  try {
    if (
      host === "youtu.be" ||
      host.endsWith("youtube.com") ||
      host === "music.youtube.com" ||
      /^[a-zA-Z0-9_-]{11}$/.test(trimmed)
    ) {
      const id = extractYouTubeId(trimmed);
      return {
        platform: "youtube",
        id,
        url: url.toString(),
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
      };
    }
  } catch {
    /* try next */
  }

  if (host.includes("tiktok.com") || host === "vm.tiktok.com") {
    return {
      platform: "tiktok",
      id: url.pathname.split("/").filter(Boolean).pop() ?? null,
      url: url.toString(),
      watchUrl: url.toString(),
    };
  }

  if (host.endsWith("vimeo.com")) {
    const id = extractVimeoId(trimmed);
    return {
      platform: "vimeo",
      id,
      url: url.toString(),
      watchUrl: `https://vimeo.com/${id}`,
    };
  }

  if (host.includes("bilibili.com") || host === "b23.tv") {
    const id = extractBilibiliId(trimmed);
    return {
      platform: "bilibili",
      id,
      url: url.toString(),
      watchUrl: id.startsWith("BV")
        ? `https://www.bilibili.com/video/${id}`
        : `https://www.bilibili.com/video/${id}`,
    };
  }

  return {
    platform: "unknown",
    id: null,
    url: url.toString(),
    watchUrl: null,
  };
}

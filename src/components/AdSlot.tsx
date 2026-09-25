"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdSlotProps = {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
};

export function AdSlot({
  slot = "",
  format = "auto",
  className = "",
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!siteConfig.adsenseClient || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // Ad blockers or missing script — ignore
    }
  }, [slot]);

  // Do not show empty placeholders during site review — looks like an ads-only page.
  if (!siteConfig.adsenseClient || !slot) {
    return null;
  }

  return (
    <aside className={`ad-slot ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={siteConfig.adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}

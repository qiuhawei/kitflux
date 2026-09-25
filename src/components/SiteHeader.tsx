"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} home`} onClick={close}>
          <span className="brand-mark" aria-hidden />
          <span className="brand-name">{siteConfig.name}</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden>{open ? "✕" : "☰"}</span>
        </button>

        <nav
          id="primary-nav"
          className={open ? "nav nav-open" : "nav"}
          aria-label="Primary"
        >
          <Link href="/tools" onClick={close}>
            Tools
          </Link>
          <Link href="/about" onClick={close}>
            About
          </Link>
          <Link href="/contact" onClick={close}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

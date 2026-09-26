"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PortalGrid } from "@/components/PortalGrid";
import {
  categories,
  categoryOrder,
  tools,
  type ToolCategory,
  type ToolDefinition,
} from "@/lib/tools";

function toolHref(tool: ToolDefinition) {
  return tool.slug === "json-formatter" ? "/json" : `/tools/${tool.slug}`;
}

export function ToolsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");
  const initial: ToolCategory | "all" =
    catParam && catParam in categories ? (catParam as ToolCategory) : "all";

  const [active, setActive] = useState<ToolCategory | "all">(initial);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setActive(initial);
  }, [initial]);

  const counts = useMemo(() => {
    const next: Partial<Record<ToolCategory | "all", number>> = { all: tools.length };
    for (const tool of tools) {
      next[tool.category] = (next[tool.category] ?? 0) + 1;
    }
    return next;
  }, []);

  function select(next: ToolCategory | "all") {
    setActive(next);
    const url = next === "all" ? "/tools" : `/tools?cat=${encodeURIComponent(next)}`;
    router.replace(url, { scroll: false });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((tool) => {
      if (active !== "all" && tool.category !== active) return false;
      if (!q) return true;
      const hay = [
        tool.name,
        tool.shortName,
        tool.description,
        tool.blurb ?? "",
        ...tool.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [active, query]);

  const sections =
    active === "all" && !query.trim()
      ? categoryOrder
          .map((category) => ({
            category,
            items: filtered.filter((tool) => tool.category === category),
          }))
          .filter((section) => section.items.length)
      : [{ category: active, items: filtered }];

  return (
    <div className="home-portal">
      <div className="filter-bar">
        <label className="search-field">
          <span className="sr-only">Search tools</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            autoComplete="off"
          />
        </label>

        <div className="portal-cats" role="tablist" aria-label="Tool categories">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            className={active === "all" ? "portal-cat portal-cat-active" : "portal-cat"}
            onClick={() => select("all")}
          >
            All
            <span className="portal-cat-count">{counts.all ?? 0}</span>
          </button>
          {categoryOrder.map((id) => {
            const count = counts[id] ?? 0;
            if (!count) return null;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active === id}
                className={active === id ? "portal-cat portal-cat-active" : "portal-cat"}
                onClick={() => select(id)}
              >
                {categories[id].label}
                <span className="portal-cat-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No tools match “{query}”.</p>
          <button type="button" className="btn btn-secondary" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        sections.map(({ category, items }) => (
          <section key={String(category)} className="portal-section">
            <div className="portal-section-head">
              <h2>
                {category === "all" ? "Results" : categories[category as ToolCategory].label}
              </h2>
              <p>
                {items.length} tool{items.length === 1 ? "" : "s"}
              </p>
            </div>
            <PortalGrid tools={items} hrefFor={toolHref} />
          </section>
        ))
      )}
    </div>
  );
}

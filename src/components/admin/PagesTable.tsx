"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PageRow, PageType } from "@/lib/admin/page-types";
import { pageTypeLabel } from "@/lib/admin/page-types";

type Props = { rows: PageRow[] };

const TYPE_ORDER: PageType[] = [
  "home",
  "city",
  "movers-city",
  "service",
  "services-listing",
  "moving-services",
  "blog-index",
  "blog-post",
  "about",
  "form",
  "sitemap",
  "confirmation",
  "other",
];

/**
 * Client-side table with type filter + free-text search. 907 rows rendered
 * as a single flat list — React handles this fine without virtualization
 * for a page that exists to be browsed manually. If we ever approach
 * ~5000+ rows we can swap to react-virtual.
 */
export function PagesTable({ rows }: Props) {
  const [typeFilter, setTypeFilter] = useState<PageType | "all">("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(100);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (q && !r.slug.toLowerCase().includes(q) && !r.url.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, typeFilter, query]);

  const visible = filtered.slice(0, limit);

  const byType = useMemo(() => {
    const counts = new Map<PageType, number>();
    for (const r of rows) counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    return counts;
  }, [rows]);

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по slug / URL"
            className="h-10 w-full rounded-md border border-dark/12 bg-surface px-3 text-[15px] outline-none focus:border-dark"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as PageType | "all")}
          className="h-10 rounded-md border border-dark/12 bg-surface px-3 text-[15px] outline-none focus:border-dark"
        >
          <option value="all">Все типы ({rows.length})</option>
          {TYPE_ORDER.map((t) => {
            const n = byType.get(t) ?? 0;
            if (!n) return null;
            return (
              <option key={t} value={t}>
                {pageTypeLabel(t)} ({n})
              </option>
            );
          })}
        </select>
        <span className="caption text-dark/56">
          показано {Math.min(limit, filtered.length)} из {filtered.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark/6 bg-dark/6">
              <th className="caption px-4 py-3 text-left font-semibold text-dark/56">Тип</th>
              <th className="caption px-4 py-3 text-left font-semibold text-dark/56">URL</th>
              <th className="caption px-4 py-3 text-right font-semibold text-dark/56">Размер</th>
              <th className="caption px-4 py-3 text-right font-semibold text-dark/56">Обновлено</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.slug} className="border-b border-dark/6 last:border-0 hover:bg-dark/6">
                <td className="px-4 py-3">
                  <span className="caption rounded-full bg-dark/6 px-2.5 py-1 font-semibold text-dark/56">
                    {pageTypeLabel(r.type)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={r.url} target="_blank" className="p2 font-mono text-dark hover:text-link">
                    {r.url}
                  </Link>
                </td>
                <td className="caption whitespace-nowrap px-4 py-3 text-right text-dark/56">
                  {(r.bytes / 1024).toFixed(1)} KB
                </td>
                <td className="caption whitespace-nowrap px-4 py-3 text-right text-dark/56">
                  {r.mtime.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length < filtered.length && (
          <div className="border-t border-dark/6 p-3 text-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + 200)}
              className="caption rounded-md border border-dark/12 px-3 py-1.5 text-dark hover:bg-dark/6"
            >
              Показать ещё 200
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

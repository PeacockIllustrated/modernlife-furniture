"use client";

import { useMemo, useState } from "react";
import PieceCard from "@/components/collection/PieceCard";
import { statusLabel } from "@/lib/format";
import type { Category, Piece, PieceImage } from "@/lib/collection";
import type { PieceStatus } from "@/lib/supabase/types";

/**
 * The shop floor: every piece in one grid, with the era, availability and a
 * search box narrowing it. Filtering happens in the browser over the list
 * the page already rendered, so a buyer changing their mind costs no round
 * trip and the page stays statically prerendered.
 *
 * Sold pieces are kept in the grid rather than hidden. They are one of one,
 * so a sold piece is proof the good ones move, and it routes to registering
 * interest in the next like it.
 */

// The statuses a buyer would filter by, in the order they care about.
const STATUS_FILTERS: PieceStatus[] = [
  "available",
  "reserved",
  "restoration",
  "sold",
];

export default function ShopGrid({
  pieces,
  images,
  categories,
}: {
  pieces: Piece[];
  images: Record<string, PieceImage | null>;
  categories: Category[];
}) {
  const [era, setEra] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  // Era counts label the chips, so the shape of the stock reads before any
  // filter is touched.
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of pieces) {
      map.set(p.categorySlug, (map.get(p.categorySlug) ?? 0) + 1);
    }
    return map;
  }, [pieces]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pieces.filter((p) => {
      if (era !== "all" && p.categorySlug !== era) return false;
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return [p.title, p.attribution, p.periodLabel, p.origin, ...p.materials]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [pieces, era, status, query]);

  const filtered = era !== "all" || status !== "all" || query.trim() !== "";
  const clear = () => {
    setEra("all");
    setStatus("all");
    setQuery("");
  };

  return (
    <>
      <div className="shop-filters">
        <div className="shop-chips" role="group" aria-label="Filter by era">
          <button
            type="button"
            className="shop-chip"
            aria-pressed={era === "all"}
            onClick={() => setEra("all")}
          >
            All eras
            <span className="shop-chip-count">{pieces.length}</span>
          </button>
          {/* An era with nothing in it is a dead end for a buyer, so it
              stays off the bar until something lands in it. */}
          {categories
            .filter((c) => (counts.get(c.slug) ?? 0) > 0)
            .map((c) => (
              <button
                key={c.slug}
                type="button"
                className="shop-chip"
                aria-pressed={era === c.slug}
                onClick={() => setEra(c.slug)}
              >
                {c.name}
                <span className="shop-chip-count">{counts.get(c.slug)}</span>
              </button>
            ))}
        </div>

        <div className="shop-controls">
          <input
            type="search"
            className="shop-search"
            aria-label="Search the collection"
            placeholder="Search by name, maker or material"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="shop-select"
            aria-label="Filter by availability"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Any availability</option>
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="shop-count mono" role="status">
        <span>
          {shown.length === pieces.length
            ? `${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"}`
            : `${shown.length} of ${pieces.length} ${
                pieces.length === 1 ? "piece" : "pieces"
              }`}
        </span>
        {filtered ? (
          <button type="button" className="shop-clear" onClick={clear}>
            Clear filters
          </button>
        ) : null}
      </div>

      {shown.length === 0 ? (
        <p className="shop-empty">
          Nothing matches that just now. The best pieces rarely reach the
          website, so tell us what you are after and we will find it.
        </p>
      ) : (
        <div className="pc-grid">
          {shown.map((piece, i) => (
            <PieceCard
              key={piece.slug}
              piece={piece}
              image={images[piece.slug] ?? null}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import PieceEditor from "@/components/admin/PieceEditor";
import DeleteConfirm from "@/components/admin/DeleteConfirm";
import { STATUSES } from "@/components/admin/types";
import type { AdminData } from "@/components/admin/types";

/**
 * The pieces tab: the collection list with inline editing. The list filters
 * as you type across title, slug, attribution and catalogue number, with a
 * status filter beside it; each row shows the first photograph, the status
 * as a coloured dot and a link to the live page. Each piece opens the full
 * template editor fed with its child rows filtered from the one dashboard
 * load; saving or deleting asks the shell to reload everything.
 */

export default function PiecesPanel({
  data,
  onReload,
}: {
  data: AdminData;
  onReload: () => void;
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  // The first image per piece, in position order, feeds the row thumbnails.
  const thumbs = useMemo(() => {
    const map = new Map<string, string>();
    const sorted = [...data.images].sort((a, b) => a.position - b.position);
    for (const img of sorted) {
      if (img.path && !map.has(img.piece_id)) map.set(img.piece_id, img.path);
    }
    return map;
  }, [data.images]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.pieces.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return [p.title, p.slug, p.attribution, p.catalogue_number].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [data.pieces, query, status]);

  async function deletePiece(id: string) {
    await fetch(`/api/admin/pieces?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setEditing(null);
    onReload();
  }

  const done = () => {
    setEditing(null);
    onReload();
  };

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2 className="admin-h">Pieces</h2>
        <button
          className="enquire"
          type="button"
          onClick={() => setEditing(editing === "new" ? null : "new")}
        >
          {editing === "new" ? "Close" : "New piece"}
        </button>
      </div>

      {editing === "new" ? (
        <PieceEditor
          categories={data.categories}
          onDone={done}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      <div className="admin-filter">
        <input
          type="search"
          aria-label="Search pieces"
          placeholder="Search title, slug, attribution or number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="mono" style={{ opacity: 0.6 }}>
          No pieces match.
        </p>
      ) : null}

      <ul className="admin-list">
        {shown.map((piece) => (
          <li key={piece.id} className="admin-piece">
            <div className="admin-piece-row admin-has-thumb">
              {thumbs.get(piece.id) ? (
                // A plain img is fine in the dashboard; next/image buys nothing here.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="admin-thumb"
                  src={thumbs.get(piece.id)}
                  alt=""
                />
              ) : (
                <span className="admin-thumb" aria-hidden="true" />
              )}
              <div className="admin-piece-main">
                <span className="mono admin-status" data-status={piece.status}>
                  <span className="admin-status-dot" aria-hidden="true" />
                  <span style={{ opacity: 0.6 }}>
                    {piece.catalogue_number
                      ? `${piece.catalogue_number} · `
                      : ""}
                    {piece.status}
                    {piece.placeholder ? " · placeholder" : ""}
                    {piece.featured ? " · starred" : ""}
                  </span>
                </span>
                <p>
                  <strong>{piece.title}</strong>
                  <span style={{ opacity: 0.6 }}> · {piece.attribution}</span>
                </p>
              </div>
              <div className="admin-piece-actions mono">
                <a
                  className="admin-view-link"
                  href={`/piece/${piece.slug}`}
                  target="_blank"
                  rel="noopener"
                >
                  View on site
                </a>
                <button
                  className="enquire"
                  type="button"
                  onClick={() =>
                    setEditing(editing === piece.id ? null : piece.id)
                  }
                >
                  {editing === piece.id ? "Close" : "Edit"}
                </button>
                <DeleteConfirm
                  label="Delete"
                  message="Delete this piece? This cannot be undone."
                  onConfirm={() => deletePiece(piece.id)}
                />
              </div>
            </div>
            {editing === piece.id ? (
              <PieceEditor
                categories={data.categories}
                piece={piece}
                provenance={data.provenance.filter(
                  (r) => r.piece_id === piece.id,
                )}
                images={data.images.filter((r) => r.piece_id === piece.id)}
                features={data.features.filter((r) => r.piece_id === piece.id)}
                specs={data.specs.filter((r) => r.piece_id === piece.id)}
                included={data.included.filter((r) => r.piece_id === piece.id)}
                faqs={data.faqs.filter((r) => r.piece_id === piece.id)}
                onDone={done}
                onCancel={() => setEditing(null)}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

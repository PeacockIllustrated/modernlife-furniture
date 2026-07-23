"use client";

import { useState } from "react";
import PieceEditor from "@/components/admin/PieceEditor";
import type { AdminData } from "@/components/admin/types";

/**
 * The pieces tab: the collection list with inline editing. Each piece opens
 * the full template editor fed with its child rows filtered from the one
 * dashboard load; saving or deleting asks the shell to reload everything.
 */

export default function PiecesPanel({
  data,
  onReload,
}: {
  data: AdminData;
  onReload: () => void;
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);

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
        <PieceEditor categories={data.categories} onDone={done} />
      ) : null}

      <ul className="admin-list">
        {data.pieces.map((piece) => (
          <li key={piece.id} className="admin-piece">
            <div className="admin-piece-row">
              <div>
                <span className="mono" style={{ opacity: 0.6 }}>
                  {piece.catalogue_number ? `${piece.catalogue_number} · ` : ""}
                  {piece.status}
                  {piece.placeholder ? " · placeholder" : ""}
                  {piece.featured ? " · featured" : ""}
                </span>
                <p>
                  <strong>{piece.title}</strong>
                  <span style={{ opacity: 0.6 }}> · {piece.attribution}</span>
                </p>
              </div>
              <div className="admin-piece-actions mono">
                <button
                  className="enquire"
                  type="button"
                  onClick={() =>
                    setEditing(editing === piece.id ? null : piece.id)
                  }
                >
                  {editing === piece.id ? "Close" : "Edit"}
                </button>
                <button
                  className="enquire"
                  type="button"
                  onClick={() => deletePiece(piece.id)}
                >
                  Delete
                </button>
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
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useMemo } from "react";
import type { AdminInterest, AdminPiece } from "@/components/admin/types";

/**
 * The interest tab: "I want this" rows rolled up per piece, most wanted
 * first, with whatever contact details were left. Clear removes every row
 * for the piece, optimistically through the shell.
 */

export default function InterestPanel({
  interest,
  pieces,
  onClear,
}: {
  interest: AdminInterest[];
  pieces: AdminPiece[];
  onClear: (pieceId: string) => void;
}) {
  // Roll interest up per piece: a count and the emails that were left, most
  // wanted first. Pieces with no interest are omitted.
  const interestByPiece = useMemo(() => {
    const titles = new Map(pieces.map((p) => [p.id, p.title]));
    const groups = new Map<
      string,
      { pieceId: string; title: string; count: number; emails: string[] }
    >();
    for (const row of interest) {
      const existing =
        groups.get(row.piece_id) ??
        {
          pieceId: row.piece_id,
          title: titles.get(row.piece_id) ?? "Unknown piece",
          count: 0,
          emails: [],
        };
      existing.count += 1;
      if (row.email) existing.emails.push(row.email);
      groups.set(row.piece_id, existing);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count);
  }, [interest, pieces]);

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h2 className="dash-h">Interest</h2>
          <p className="dash-sub">
            People who tapped &quot;tell me about this piece&quot;, the most
            wanted first. A good sign of what to buy more of.
          </p>
        </div>
      </div>
      {interestByPiece.length === 0 ? (
        <p className="dash-clear">
          No one has registered interest yet. The button sits on every piece
          page, under the price.
        </p>
      ) : (
        <ul className="admin-list">
          {interestByPiece.map((g) => (
            <li key={g.pieceId} className="admin-enquiry">
              <div>
                <span className="mono">
                  {g.count} {g.count === 1 ? "person" : "people"} interested
                </span>
                <p>
                  <strong>{g.title}</strong>
                </p>
                {g.emails.length ? (
                  <p style={{ opacity: 0.85 }}>
                    {g.emails.map((em, i) => (
                      <span key={em + i}>
                        <a href={`mailto:${em}`}>{em}</a>
                        {i < g.emails.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="mono" style={{ opacity: 0.55 }}>
                    No contact details left.
                  </p>
                )}
              </div>
              <button
                className="enquire"
                type="button"
                onClick={() => onClear(g.pieceId)}
              >
                Clear
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

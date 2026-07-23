"use client";

import type { AdminEnquiry } from "@/components/admin/types";

/**
 * The enquiries tab, unchanged in behaviour from the original dashboard:
 * newest first, a mailto link per sender, and a Clear that removes the row
 * optimistically through the shell.
 */

export default function EnquiriesPanel({
  enquiries,
  onDelete,
}: {
  enquiries: AdminEnquiry[];
  onDelete: (id: string) => void;
}) {
  return (
    <section className="admin-section">
      <h2 className="admin-h">Enquiries</h2>
      {enquiries.length === 0 ? (
        <p className="mono" style={{ opacity: 0.6 }}>
          No enquiries yet.
        </p>
      ) : (
        <ul className="admin-list">
          {enquiries.map((en) => (
            <li key={en.id} className="admin-enquiry">
              <div>
                <span className="mono">
                  {en.kind} · {new Date(en.created_at).toLocaleDateString("en-GB")}
                </span>
                <p>
                  <strong>{en.name}</strong>{" "}
                  <a href={`mailto:${en.email}`}>{en.email}</a>
                </p>
                <p style={{ opacity: 0.85 }}>{en.message}</p>
              </div>
              <button
                className="enquire"
                type="button"
                onClick={() => onDelete(en.id)}
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

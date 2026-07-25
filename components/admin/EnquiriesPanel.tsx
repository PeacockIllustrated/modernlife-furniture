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
    <section className="dash-panel">
      <div className="dash-panel-head">
        <div>
          <h2 className="dash-h">Enquiries</h2>
          <p className="dash-sub">
            Buyers who have written in, newest first. Click the address to
            reply from your own email, then clear the row when it is dealt
            with.
          </p>
        </div>
      </div>
      {enquiries.length === 0 ? (
        <p className="dash-clear">
          No one has written in yet. Enquiries from every piece page land here.
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

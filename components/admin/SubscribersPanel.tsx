"use client";

import DeleteConfirm from "@/components/admin/DeleteConfirm";
import type { AdminSubscriber } from "@/components/admin/types";

/**
 * The acquisitions list tab: who has joined through the footer form, newest
 * first, with the joining date and a per-row Remove. Additions only ever
 * come from the public subscribe route.
 */

export default function SubscribersPanel({
  subscribers,
  onRemove,
}: {
  subscribers: AdminSubscriber[];
  onRemove: (id: string) => void;
}) {
  const count =
    subscribers.length === 0
      ? "No one on the list yet."
      : subscribers.length === 1
        ? "One address on the list."
        : `${subscribers.length} addresses on the list.`;

  return (
    <section className="admin-section">
      <h2 className="admin-h">The list</h2>
      <p className="mono admin-count">{count}</p>
      {subscribers.length === 0 ? null : (
        <ul className="admin-list">
          {subscribers.map((s) => (
            <li key={s.id} className="admin-enquiry">
              <div>
                <span className="mono">
                  Joined {new Date(s.created_at).toLocaleDateString("en-GB")}
                </span>
                <p>
                  <a href={`mailto:${s.email}`}>{s.email}</a>
                </p>
              </div>
              <DeleteConfirm
                label="Remove"
                message="Remove this address? This cannot be undone."
                onConfirm={() => onRemove(s.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

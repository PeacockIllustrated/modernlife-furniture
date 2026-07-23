"use client";

import { useState } from "react";
import { storeSettings } from "@/content/store";
import type { StoreSettings } from "@/content/store";
import type { AdminSetting } from "@/components/admin/types";

/**
 * The site tab edits the six prose settings the store chrome and piece pages
 * read: the announcement strip, delivery, returns, care and viewing prose,
 * and the newsletter lead. Stored values are laid over the static defaults
 * from content/store.ts, the same merge the public site performs, so the
 * form always starts complete.
 */

const FIELDS: { key: keyof StoreSettings; label: string }[] = [
  { key: "announcement", label: "Announcement (the strip above the header)" },
  { key: "deliveryProse", label: "Delivery" },
  { key: "returnsProse", label: "Returns" },
  { key: "careProse", label: "Care" },
  { key: "viewingProse", label: "Viewings" },
  { key: "newsletterLead", label: "Newsletter lead" },
];

export default function SitePanel({
  settings,
  onReload,
}: {
  settings: AdminSetting[];
  onReload: () => void;
}) {
  const stored = (settings.find((s) => s.key === "store")?.value ??
    {}) as Partial<StoreSettings>;
  const [form, setForm] = useState<StoreSettings>({
    ...storeSettings,
    ...stored,
  });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ tone: "ok" | "error"; text: string } | null>(
    null,
  );

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: form }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Could not save.");
      }
      setNote({ tone: "ok", text: "Saved." });
      onReload();
    } catch (err) {
      setNote({
        tone: "error",
        text: err instanceof Error ? err.message : "Could not save.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-section">
      <h2 className="admin-h">Site copy</h2>
      <form className="form admin-form" onSubmit={save}>
        {FIELDS.map(({ key, label }) => (
          <div key={key} className="field">
            <label>{label}</label>
            <textarea
              value={form[key]}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
            />
          </div>
        ))}
        <button className="enquire" type="submit" disabled={busy}>
          {busy ? "Saving" : "Save the site copy"}
        </button>
        {note ? (
          <p className="form-note mono" data-tone={note.tone} role="status">
            {note.text}
          </p>
        ) : null}
      </form>
    </section>
  );
}

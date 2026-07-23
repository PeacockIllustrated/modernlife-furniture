"use client";

import { useState } from "react";
import { storeSettings } from "@/content/store";
import type { StoreSettings } from "@/content/store";
import type { AdminSetting } from "@/components/admin/types";
import UploadButton from "@/components/admin/UploadButton";

/**
 * The site tab edits the store settings the chrome and home page read: the
 * announcement strip, the four prose passages and the newsletter lead, then
 * the home page slots, the hero photograph and headline and the workshop
 * band photograph. Stored values are laid over the static defaults from
 * content/store.ts, the same merge the public site performs, so the form
 * always starts complete. An empty image path simply leaves the generative
 * visual in place on the public page.
 */

const PROSE_FIELDS: { key: keyof StoreSettings; label: string }[] = [
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

  const set = (key: keyof StoreSettings) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Upload failures arrive as one sentence; an empty note clears the slate
  // when a fresh upload begins.
  const uploadNote = (text: string) =>
    setNote(text ? { tone: "error", text } : null);

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

  // A labelled image slot: a 44px preview, the path itself and an upload
  // button, the same row the piece editor uses for its photographs.
  function imageRow(
    label: string,
    key: "heroImage" | "workshopImage",
    altKey: "heroAlt" | "workshopAlt",
    altLabel: string,
  ) {
    return (
      <>
        <div className="field">
          <label htmlFor={`site-${key}`}>{label}</label>
          <div className="admin-subrow">
            {form[key] ? (
              // A plain img is fine in the dashboard; next/image buys nothing here.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="admin-thumb" src={form[key]} alt="" />
            ) : (
              <span className="admin-thumb" aria-hidden="true" />
            )}
            <input
              id={`site-${key}`}
              placeholder="Image path or URL, empty keeps the generative visual"
              value={form[key]}
              onChange={(e) => set(key)(e.target.value)}
            />
            <UploadButton slug="site" onUploaded={set(key)} onNote={uploadNote} />
          </div>
        </div>
        <div className="field">
          <label htmlFor={`site-${altKey}`}>{altLabel}</label>
          <input
            id={`site-${altKey}`}
            value={form[altKey]}
            onChange={(e) => set(altKey)(e.target.value)}
          />
        </div>
      </>
    );
  }

  return (
    <section className="admin-section">
      <h2 className="admin-h">Site copy</h2>
      <form className="form admin-form" onSubmit={save}>
        {PROSE_FIELDS.map(({ key, label }) => (
          <div key={key} className="field">
            <label htmlFor={`site-${key}`}>{label}</label>
            <textarea
              id={`site-${key}`}
              value={form[key]}
              onChange={(e) => set(key)(e.target.value)}
            />
          </div>
        ))}

        <h2 className="admin-h">Home page</h2>
        <div className="field">
          <label htmlFor="site-heroHeadline">Hero headline</label>
          <input
            id="site-heroHeadline"
            value={form.heroHeadline}
            onChange={(e) => set("heroHeadline")(e.target.value)}
          />
          <p className="admin-hint">
            Shown on the photographic hero. Wrap one word in asterisks for
            italics, for example Live with a piece of *history*.
          </p>
        </div>
        {imageRow(
          "Hero image (empty keeps the generative hero)",
          "heroImage",
          "heroAlt",
          "Hero image alt text",
        )}
        {imageRow(
          "Workshop band image (empty keeps the bench drawing)",
          "workshopImage",
          "workshopAlt",
          "Workshop image alt text",
        )}

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

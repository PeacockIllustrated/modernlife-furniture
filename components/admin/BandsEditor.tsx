"use client";

import UploadButton from "@/components/admin/UploadButton";
import { LAYOUTS, move } from "@/components/admin/types";
import type { BandDraft } from "@/components/admin/types";
import type { FeatureLayout } from "@/lib/supabase/types";

/**
 * The story bands section of the piece editor, one block per band in page
 * order. Each band carries its eyebrow, title, body, layout and an optional
 * photograph; a band without a photograph falls back to the category's
 * generative panel on the piece page.
 */

export default function BandsEditor({
  slug,
  rows,
  onChange,
  onNote,
  defaultOpen,
}: {
  slug: string;
  rows: BandDraft[];
  // A functional updater, so an upload finishing late computes from the
  // current rows rather than reverting edits made while it was in flight.
  onChange: (update: (rows: BandDraft[]) => BandDraft[]) => void;
  onNote: (note: string) => void;
  defaultOpen: boolean;
}) {
  const update = (i: number, patch: Partial<BandDraft>) =>
    onChange((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <details className="admin-details" open={defaultOpen}>
      <summary className="admin-summary mono">
        <span className="admin-plus" aria-hidden="true" />
        Story bands, {rows.length}
      </summary>
      <div className="admin-details-body">
      <p className="admin-hint">
        Wrap one word of a title in asterisks for italics, for example
        Restored on the *bench*. A band without an image shows the room&#39;s
        generative panel instead.
      </p>
      {rows.map((r, i) => (
        <div key={r.id ?? `new-${i}`} className="admin-band">
          <div className="admin-subrow">
            <input
              placeholder="Eyebrow, e.g. The shell"
              aria-label="Band eyebrow"
              value={r.eyebrow}
              onChange={(e) => update(i, { eyebrow: e.target.value })}
            />
            <input
              placeholder="Title"
              aria-label="Band title"
              value={r.title}
              onChange={(e) => update(i, { title: e.target.value })}
            />
            <select
              aria-label="Band layout"
              value={r.layout}
              onChange={(e) =>
                update(i, { layout: e.target.value as FeatureLayout })
              }
            >
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-subrow">
            <textarea
              placeholder="Body"
              aria-label="Band body"
              value={r.body}
              onChange={(e) => update(i, { body: e.target.value })}
            />
          </div>
          <div className="admin-subrow">
            {r.image_path ? (
              // A plain img is fine in the dashboard; next/image buys nothing here.
              // eslint-disable-next-line @next/next/no-img-element
              <img className="admin-thumb" src={r.image_path} alt="" />
            ) : (
              <span className="admin-thumb" aria-hidden="true" />
            )}
            <input
              placeholder="Image path or URL"
              aria-label="Band image path"
              value={r.image_path}
              onChange={(e) => update(i, { image_path: e.target.value })}
            />
            <input
              placeholder="Image alt text"
              aria-label="Band image alt text"
              value={r.image_alt}
              onChange={(e) => update(i, { image_alt: e.target.value })}
            />
            <div className="admin-row-actions">
              <UploadButton
                slug={slug}
                onUploaded={(path) => update(i, { image_path: path })}
                onNote={onNote}
              />
              <button
                type="button"
                className="enquire"
                disabled={i === 0}
                onClick={() => onChange((rs) => move(rs, i, i - 1))}
              >
                Up
              </button>
              <button
                type="button"
                className="enquire"
                disabled={i === rows.length - 1}
                onClick={() => onChange((rs) => move(rs, i, i + 1))}
              >
                Down
              </button>
              <button
                type="button"
                className="enquire"
                onClick={() => onChange((rs) => rs.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="enquire"
        onClick={() =>
          onChange((rs) => [
            ...rs,
            {
              eyebrow: "",
              title: "",
              body: "",
              image_path: "",
              image_alt: "",
              layout: "right",
            },
          ])
        }
      >
        Add band
      </button>
      </div>
    </details>
  );
}

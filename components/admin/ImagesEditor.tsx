"use client";

import UploadButton from "@/components/admin/UploadButton";
import { IMAGE_KINDS, move } from "@/components/admin/types";
import type { ImageDraft } from "@/components/admin/types";
import type { ImageKind } from "@/lib/supabase/types";

/**
 * The images fieldset of the piece editor: a thumbnail preview, the path
 * (filled by upload or typed by hand), alt text, the kind, and reorder
 * controls. Row order becomes position on save, so the first row is the
 * piece page's main photograph.
 */

export default function ImagesEditor({
  slug,
  rows,
  onChange,
  onNote,
}: {
  slug: string;
  rows: ImageDraft[];
  // A functional updater, so an upload finishing late computes from the
  // current rows rather than reverting edits made while it was in flight.
  onChange: (update: (rows: ImageDraft[]) => ImageDraft[]) => void;
  onNote: (note: string) => void;
}) {
  const update = (i: number, patch: Partial<ImageDraft>) =>
    onChange((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <fieldset className="admin-fieldset">
      <legend className="mono">Images</legend>
      <p className="admin-hint">
        The first image is the main photograph. Upload fills the path for you.
      </p>
      {rows.map((r, i) => (
        <div key={r.id ?? `new-${i}`} className="admin-subrow">
          {r.path ? (
            // A plain img is fine in the dashboard; next/image buys nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="admin-thumb" src={r.path} alt="" />
          ) : (
            <span className="admin-thumb" aria-hidden="true" />
          )}
          <input
            placeholder="Path or URL"
            aria-label="Image path"
            value={r.path}
            onChange={(e) => update(i, { path: e.target.value })}
          />
          <input
            placeholder="Alt text"
            aria-label="Alt text"
            value={r.alt}
            onChange={(e) => update(i, { alt: e.target.value })}
          />
          <select
            aria-label="Image kind"
            value={r.kind}
            onChange={(e) => update(i, { kind: e.target.value as ImageKind })}
          >
            {IMAGE_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <div className="admin-row-actions">
            <UploadButton
              slug={slug}
              onUploaded={(path) => update(i, { path })}
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
      ))}
      <button
        type="button"
        className="enquire"
        onClick={() =>
          onChange((rs) => [...rs, { path: "", alt: "", kind: "detail" }])
        }
      >
        Add image
      </button>
    </fieldset>
  );
}

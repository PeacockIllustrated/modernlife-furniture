"use client";

import { useState } from "react";
import ImagesEditor from "@/components/admin/ImagesEditor";
import BandsEditor from "@/components/admin/BandsEditor";
import { STATUSES, SECTION_TOGGLES } from "@/components/admin/types";
import type {
  AdminCategory,
  AdminPiece,
  AdminProvenance,
  AdminImage,
  AdminFeature,
  AdminSpec,
  AdminIncluded,
  AdminFaq,
  ImageDraft,
  BandDraft,
} from "@/components/admin/types";
import type { PieceStatus } from "@/lib/supabase/types";

/**
 * The full piece template editor. Everything a piece page shows is composed
 * here: the record fields, the nine section toggles, and the child rows in
 * the template's display order. One POST to /api/admin/pieces saves the lot;
 * the server replaces every child table wholesale with positions following
 * row order, so the form order is the page order.
 */

// An empty year field means unknown; anything else is rounded to a year.
const toYear = (v: string): number | null => {
  const trimmed = v.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? Math.round(n) : null;
};

// A title becomes a url slug: ascii-folded, lowercased, hyphenated.
const slugify = (v: string): string =>
  v
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function PieceEditor({
  categories,
  piece,
  provenance = [],
  images = [],
  features = [],
  specs = [],
  included = [],
  faqs = [],
  onDone,
  onCancel,
}: {
  categories: AdminCategory[];
  piece?: AdminPiece;
  provenance?: AdminProvenance[];
  images?: AdminImage[];
  features?: AdminFeature[];
  specs?: AdminSpec[];
  included?: AdminIncluded[];
  faqs?: AdminFaq[];
  onDone: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState({
    slug: piece?.slug ?? "",
    category_id: piece?.category_id ?? categories[0]?.id ?? "",
    title: piece?.title ?? "",
    catalogue_number: piece?.catalogue_number ?? "",
    attribution: piece?.attribution ?? "",
    period_label: piece?.period_label ?? "",
    year_from: piece?.year_from != null ? String(piece.year_from) : "",
    year_to: piece?.year_to != null ? String(piece.year_to) : "",
    origin: piece?.origin ?? "",
    materials: piece?.materials.join(", ") ?? "",
    status: piece?.status ?? "available",
    price: piece?.price_pence != null ? String(piece.price_pence / 100) : "",
    price_on_request: piece?.price_on_request ?? true,
    placeholder: piece?.placeholder ?? true,
    featured: piece?.featured ?? false,
    featured_position:
      piece?.featured_position != null ? String(piece.featured_position) : "",
    provenance_verified: piece?.provenance_verified ?? false,
    story: piece?.story ?? "",
    restoration_notes: piece?.restoration_notes ?? "",
  });
  // An absent key means enabled, so every toggle starts true unless the
  // piece explicitly switched it off. Saving writes all nine back.
  const [toggles, setTogglesRaw] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      SECTION_TOGGLES.map(({ key }) => [
        key,
        piece?.section_toggles?.[key] ?? true,
      ]),
    ),
  );
  const [provRows, setProvRowsRaw] = useState<
    { id?: string; label: string; detail: string }[]
  >(provenance.map((r) => ({ id: r.id, label: r.label, detail: r.detail })));
  const [imgRows, setImgRowsRaw] = useState<ImageDraft[]>(
    images.map((r) => ({ id: r.id, path: r.path, alt: r.alt, kind: r.kind })),
  );
  const [bandRows, setBandRowsRaw] = useState<BandDraft[]>(
    features.map((r) => ({
      id: r.id,
      eyebrow: r.eyebrow,
      title: r.title,
      body: r.body,
      image_path: r.image_path,
      image_alt: r.image_alt,
      layout: r.layout,
    })),
  );
  const [specRows, setSpecRowsRaw] = useState<
    { id?: string; grouping: string; term: string; detail: string }[]
  >(
    specs.map((r) => ({
      id: r.id,
      grouping: r.grouping,
      term: r.term,
      detail: r.detail,
    })),
  );
  const [inclRows, setInclRowsRaw] = useState<
    { id?: string; label: string; note: string }[]
  >(included.map((r) => ({ id: r.id, label: r.label, note: r.note })));
  const [faqRows, setFaqRowsRaw] = useState<
    { id?: string; question: string; answer: string; published: boolean }[]
  >(
    faqs.map((r) => ({
      id: r.id,
      question: r.question,
      answer: r.answer,
      published: r.published,
    })),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploadNote, setUploadNote] = useState("");

  // One dirty flag, set on the first change to anything, drives the
  // unsaved-changes note in the sticky actions bar. Every state setter the
  // form and the child editors use is wrapped to flip it.
  const [dirty, setDirty] = useState(false);
  const setToggles: typeof setTogglesRaw = (v) => {
    setDirty(true);
    setTogglesRaw(v);
  };
  const setProvRows: typeof setProvRowsRaw = (v) => {
    setDirty(true);
    setProvRowsRaw(v);
  };
  const setImgRows: typeof setImgRowsRaw = (v) => {
    setDirty(true);
    setImgRowsRaw(v);
  };
  const setBandRows: typeof setBandRowsRaw = (v) => {
    setDirty(true);
    setBandRowsRaw(v);
  };
  const setSpecRows: typeof setSpecRowsRaw = (v) => {
    setDirty(true);
    setSpecRowsRaw(v);
  };
  const setInclRows: typeof setInclRowsRaw = (v) => {
    setDirty(true);
    setInclRowsRaw(v);
  };
  const setFaqRows: typeof setFaqRowsRaw = (v) => {
    setDirty(true);
    setFaqRowsRaw(v);
  };

  // A new piece writes its slug from the title until the slug is edited by
  // hand; an existing piece's slug never changes on its own.
  const [slugTouched, setSlugTouched] = useState(Boolean(piece));

  // Child sections open by default on a new piece and start collapsed when
  // editing, so a long existing piece reads as a short table of contents.
  const sectionsOpen = !piece;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // A priced piece needs a real figure; letters must not save as zero.
    if (!form.price_on_request) {
      const pounds = Number(form.price.trim().replace(/[^0-9.]/g, ""));
      if (!form.price.trim() || !Number.isFinite(pounds) || pounds <= 0) {
        setError("The price needs to be a number in pounds.");
        return;
      }
    }
    setBusy(true);
    setError("");
    try {
      const payload = {
        id: piece?.id,
        piece: {
          slug: form.slug.trim(),
          category_id: form.category_id,
          title: form.title.trim(),
          attribution: form.attribution.trim(),
          period_label: form.period_label.trim(),
          catalogue_number: form.catalogue_number.trim(),
          year_from: toYear(form.year_from),
          year_to: toYear(form.year_to),
          origin: form.origin.trim(),
          materials: form.materials
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
          status: form.status as PieceStatus,
          price_on_request: form.price_on_request,
          price_pence:
            form.price_on_request || !form.price.trim()
              ? null
              : Math.round(
                  Number(form.price.trim().replace(/[^0-9.]/g, "")) * 100,
                ),
          placeholder: form.placeholder,
          featured: form.featured,
          featured_position:
            form.featured && form.featured_position.trim()
              ? Math.round(Number(form.featured_position.trim()))
              : null,
          provenance_verified: form.provenance_verified,
          story: form.story.trim(),
          restoration_notes: form.restoration_notes.trim(),
          section_toggles: { ...toggles },
        },
        provenance: provRows.map((r) => ({ label: r.label, detail: r.detail })),
        images: imgRows.map((r) => ({ path: r.path, alt: r.alt, kind: r.kind })),
        features: bandRows.map((r) => ({
          eyebrow: r.eyebrow,
          title: r.title,
          body: r.body,
          image_path: r.image_path,
          image_alt: r.image_alt,
          layout: r.layout,
        })),
        specs: specRows.map((r) => ({
          grouping: r.grouping,
          term: r.term,
          detail: r.detail,
        })),
        included: inclRows.map((r) => ({ label: r.label, note: r.note })),
        faqs: faqRows.map((r) => ({
          question: r.question,
          answer: r.answer,
          published: r.published,
        })),
      };

      const res = await fetch("/api/admin/pieces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Could not save.");
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof form, v: string | boolean) => {
    setDirty(true);
    setForm((f) => ({ ...f, [k]: v }));
  };

  return (
    <form className="form admin-form" onSubmit={save}>
      <div className="field">
        <label>Title</label>
        <input
          value={form.title}
          onChange={(e) => {
            const title = e.target.value;
            setDirty(true);
            setForm((f) => ({
              ...f,
              title,
              ...(slugTouched ? {} : { slug: slugify(title) }),
            }));
          }}
          required
        />
      </div>
      <div className="field">
        <label>Slug (url)</label>
        <input
          value={form.slug}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
          required
        />
      </div>
      <div className="field">
        <label>Catalogue number</label>
        <input
          value={form.catalogue_number}
          onChange={(e) => set("catalogue_number", e.target.value)}
          placeholder="MLF 007"
        />
      </div>
      <div className="field">
        <label>Category</label>
        <select
          value={form.category_id}
          onChange={(e) => set("category_id", e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Attribution (a hedge, never a named maker as fact)</label>
        <input
          value={form.attribution}
          onChange={(e) => set("attribution", e.target.value)}
          placeholder="Attributed, space age"
        />
      </div>
      <div className="field">
        <label>Period label</label>
        <input
          value={form.period_label}
          onChange={(e) => set("period_label", e.target.value)}
        />
      </div>
      <div className="admin-split">
        <div className="field">
          <label>Year from</label>
          <input
            inputMode="numeric"
            value={form.year_from}
            onChange={(e) => set("year_from", e.target.value)}
            placeholder="1966"
          />
        </div>
        <div className="field">
          <label>Year to</label>
          <input
            inputMode="numeric"
            value={form.year_to}
            onChange={(e) => set("year_to", e.target.value)}
            placeholder="1972"
          />
        </div>
      </div>
      <div className="field">
        <label>Origin</label>
        <input value={form.origin} onChange={(e) => set("origin", e.target.value)} />
      </div>
      <div className="field">
        <label>Materials (comma separated)</label>
        <input
          value={form.materials}
          onChange={(e) => set("materials", e.target.value)}
        />
      </div>
      <div className="field">
        <label>Status</label>
        <select value={form.status} onChange={(e) => set("status", e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <label className="admin-check mono">
        <input
          type="checkbox"
          checked={form.price_on_request}
          onChange={(e) => set("price_on_request", e.target.checked)}
        />
        Price on request (hide the figure)
      </label>
      {!form.price_on_request ? (
        <div className="field">
          <label>Price (pounds)</label>
          <input
            inputMode="decimal"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="2400"
          />
        </div>
      ) : null}
      <div className="field">
        <label>Story</label>
        <textarea value={form.story} onChange={(e) => set("story", e.target.value)} />
      </div>
      <div className="field">
        <label>Restoration notes</label>
        <textarea
          value={form.restoration_notes}
          onChange={(e) => set("restoration_notes", e.target.value)}
        />
      </div>
      <label className="admin-check mono">
        <input
          type="checkbox"
          checked={form.placeholder}
          onChange={(e) => set("placeholder", e.target.checked)}
        />
        Placeholder listing (details unconfirmed)
      </label>
      <label className="admin-check mono">
        <input
          type="checkbox"
          checked={form.provenance_verified}
          onChange={(e) => set("provenance_verified", e.target.checked)}
        />
        Provenance verified (show the seal)
      </label>
      <label className="admin-check mono">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
        />
        Starred
      </label>
      <p className="admin-hint">Starred pieces lead the home page hero.</p>
      {form.featured ? (
        <div className="field">
          <label>Star order (lower shows first)</label>
          <input
            inputMode="numeric"
            value={form.featured_position}
            onChange={(e) => set("featured_position", e.target.value)}
            placeholder="1"
          />
        </div>
      ) : null}

      <fieldset className="admin-fieldset">
        <legend className="mono">Sections</legend>
        <p className="admin-hint">
          Untick a section to hide it on the piece page. A section with
          nothing in it hides itself either way.
        </p>
        <div className="admin-toggles">
          {SECTION_TOGGLES.map(({ key, label }) => (
            <label key={key} className="admin-check mono">
              <input
                type="checkbox"
                checked={toggles[key]}
                onChange={(e) =>
                  setToggles((t) => ({ ...t, [key]: e.target.checked }))
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <ImagesEditor
        slug={form.slug.trim()}
        rows={imgRows}
        onChange={setImgRows}
        onNote={setUploadNote}
        defaultOpen={sectionsOpen}
      />

      <details className="admin-details" open={sectionsOpen}>
        <summary className="admin-summary mono">
          <span className="admin-plus" aria-hidden="true" />
          Provenance rings, {provRows.length}
        </summary>
        <div className="admin-details-body">
        {provRows.map((r, i) => (
          <div key={r.id ?? `new-${i}`} className="admin-subrow">
            <input
              placeholder="Label, e.g. Found"
              aria-label="Provenance label"
              value={r.label}
              onChange={(e) =>
                setProvRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                )
              }
            />
            <input
              placeholder="Detail"
              aria-label="Provenance detail"
              value={r.detail}
              onChange={(e) =>
                setProvRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)),
                )
              }
            />
            <button
              type="button"
              className="enquire"
              onClick={() => setProvRows((rs) => rs.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="enquire"
          onClick={() => setProvRows((rs) => [...rs, { label: "", detail: "" }])}
        >
          Add provenance
        </button>
        </div>
      </details>

      <BandsEditor
        slug={form.slug.trim()}
        rows={bandRows}
        onChange={setBandRows}
        onNote={setUploadNote}
        defaultOpen={sectionsOpen}
      />

      <details className="admin-details" open={sectionsOpen}>
        <summary className="admin-summary mono">
          <span className="admin-plus" aria-hidden="true" />
          Specification rows, {specRows.length}
        </summary>
        <div className="admin-details-body">
        <p className="admin-hint">
          Rows sharing a grouping sit under one subheading, for example
          Dimensions with Width, Depth and Height.
        </p>
        {specRows.map((r, i) => (
          <div key={r.id ?? `new-${i}`} className="admin-subrow">
            <input
              placeholder="Grouping, e.g. Dimensions"
              aria-label="Specification grouping"
              value={r.grouping}
              onChange={(e) =>
                setSpecRows((rs) =>
                  rs.map((x, j) =>
                    j === i ? { ...x, grouping: e.target.value } : x,
                  ),
                )
              }
            />
            <input
              placeholder="Term, e.g. Width"
              aria-label="Specification term"
              value={r.term}
              onChange={(e) =>
                setSpecRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, term: e.target.value } : x)),
                )
              }
            />
            <input
              placeholder="Detail, e.g. 104 centimetres"
              aria-label="Specification detail"
              value={r.detail}
              onChange={(e) =>
                setSpecRows((rs) =>
                  rs.map((x, j) =>
                    j === i ? { ...x, detail: e.target.value } : x,
                  ),
                )
              }
            />
            <button
              type="button"
              className="enquire"
              onClick={() => setSpecRows((rs) => rs.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="enquire"
          onClick={() =>
            setSpecRows((rs) => [...rs, { grouping: "", term: "", detail: "" }])
          }
        >
          Add row
        </button>
        </div>
      </details>

      <details className="admin-details" open={sectionsOpen}>
        <summary className="admin-summary mono">
          <span className="admin-plus" aria-hidden="true" />
          What comes with the piece, {inclRows.length}
        </summary>
        <div className="admin-details-body">
        <p className="admin-hint">
          Leave empty to use the standard four items from the site copy.
        </p>
        {inclRows.map((r, i) => (
          <div key={r.id ?? `new-${i}`} className="admin-subrow">
            <input
              placeholder="Label, e.g. Care notes"
              aria-label="Included item label"
              value={r.label}
              onChange={(e) =>
                setInclRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                )
              }
            />
            <input
              placeholder="Note"
              aria-label="Included item note"
              value={r.note}
              onChange={(e) =>
                setInclRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)),
                )
              }
            />
            <button
              type="button"
              className="enquire"
              onClick={() => setInclRows((rs) => rs.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="enquire"
          onClick={() => setInclRows((rs) => [...rs, { label: "", note: "" }])}
        >
          Add item
        </button>
        </div>
      </details>

      <details className="admin-details" open={sectionsOpen}>
        <summary className="admin-summary mono">
          <span className="admin-plus" aria-hidden="true" />
          Questions for this piece, {faqRows.length}
        </summary>
        <div className="admin-details-body">
        <p className="admin-hint">
          Shown before the site-wide questions on this piece&#39;s page.
        </p>
        {faqRows.map((r, i) => (
          <div key={r.id ?? `new-${i}`} className="admin-band">
            <div className="admin-subrow">
              <input
                placeholder="Question"
                aria-label="Question"
                value={r.question}
                onChange={(e) =>
                  setFaqRows((rs) =>
                    rs.map((x, j) =>
                      j === i ? { ...x, question: e.target.value } : x,
                    ),
                  )
                }
              />
            </div>
            <div className="admin-subrow">
              <textarea
                placeholder="Answer"
                aria-label="Answer"
                value={r.answer}
                onChange={(e) =>
                  setFaqRows((rs) =>
                    rs.map((x, j) =>
                      j === i ? { ...x, answer: e.target.value } : x,
                    ),
                  )
                }
              />
            </div>
            <div className="admin-subrow">
              <label className="admin-check mono">
                <input
                  type="checkbox"
                  checked={r.published}
                  onChange={(e) =>
                    setFaqRows((rs) =>
                      rs.map((x, j) =>
                        j === i ? { ...x, published: e.target.checked } : x,
                      ),
                    )
                  }
                />
                Published
              </label>
              <div className="admin-row-actions">
                <button
                  type="button"
                  className="enquire"
                  onClick={() =>
                    setFaqRows((rs) => rs.filter((_, j) => j !== i))
                  }
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
            setFaqRows((rs) => [
              ...rs,
              { question: "", answer: "", published: true },
            ])
          }
        >
          Add question
        </button>
        </div>
      </details>

      <div className="admin-actions">
        <button className="enquire" type="submit" disabled={busy}>
          {busy ? "Saving" : piece ? "Save changes" : "Create piece"}
        </button>
        <button
          className="enquire"
          type="button"
          onClick={() => (onCancel ?? onDone)()}
        >
          Cancel
        </button>
        {dirty ? (
          <span className="mono admin-unsaved" role="status">
            Unsaved changes
          </span>
        ) : null}
        {uploadNote ? (
          <p className="form-note mono" data-tone="error" role="status">
            {uploadNote}
          </p>
        ) : null}
        {error ? (
          <p className="form-note mono" data-tone="error" role="status">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}

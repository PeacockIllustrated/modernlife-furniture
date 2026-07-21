"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  PieceStatus,
  ImageKind,
  EnquiryKind,
} from "@/lib/supabase/types";

interface AdminCategory {
  id: string;
  slug: string;
  name: string;
}
interface AdminPiece {
  id: string;
  slug: string;
  category_id: string;
  title: string;
  attribution: string;
  period_label: string;
  year_from: number | null;
  year_to: number | null;
  origin: string;
  materials: string[];
  status: PieceStatus;
  price_pence: number | null;
  price_on_request: boolean;
  story: string;
  restoration_notes: string;
  placeholder: boolean;
  featured: boolean;
  featured_position: number | null;
  provenance_verified: boolean;
}
interface AdminProvenance {
  id: string;
  piece_id: string;
  position: number;
  label: string;
  detail: string;
}
interface AdminImage {
  id: string;
  piece_id: string;
  path: string;
  alt: string;
  position: number;
  kind: ImageKind;
}
interface AdminEnquiry {
  id: string;
  piece_id: string | null;
  name: string;
  email: string;
  message: string;
  kind: EnquiryKind;
  created_at: string;
}
interface AdminInterest {
  id: string;
  piece_id: string;
  email: string | null;
  created_at: string;
}

const STATUSES: PieceStatus[] = [
  "draft",
  "available",
  "reserved",
  "sold",
  "restoration",
];
const IMAGE_KINDS: ImageKind[] = ["hero", "detail", "as_found", "restored"];

export default function AdminDashboard({ email }: { email: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [pieces, setPieces] = useState<AdminPiece[]>([]);
  const [provenance, setProvenance] = useState<AdminProvenance[]>([]);
  const [images, setImages] = useState<AdminImage[]>([]);
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [interest, setInterest] = useState<AdminInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | "new" | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [c, p, pr, im, en, it] = await Promise.all([
      supabase.from("modern_categories").select("id,slug,name").order("position"),
      supabase.from("modern_pieces").select("*").order("created_at", { ascending: false }),
      supabase.from("modern_provenance").select("*").order("position"),
      supabase.from("modern_piece_images").select("*").order("position"),
      supabase.from("modern_enquiries").select("*").order("created_at", { ascending: false }),
      supabase.from("modern_interest").select("*").order("created_at", { ascending: false }),
    ]);
    setCategories((c.data ?? []) as AdminCategory[]);
    setPieces((p.data ?? []) as AdminPiece[]);
    setProvenance((pr.data ?? []) as AdminProvenance[]);
    setImages((im.data ?? []) as AdminImage[]);
    setEnquiries((en.data ?? []) as AdminEnquiry[]);
    setInterest((it.data ?? []) as AdminInterest[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  async function deleteEnquiry(id: string) {
    const { error } = await supabase.from("modern_enquiries").delete().eq("id", id);
    // Only drop it from the view if it really went; otherwise reload so the
    // dashboard reflects the truth rather than hiding a still-present enquiry.
    if (error) loadAll();
    else setEnquiries((e) => e.filter((x) => x.id !== id));
  }

  async function deletePiece(id: string) {
    await supabase.from("modern_pieces").delete().eq("id", id);
    setEditing(null);
    loadAll();
  }

  async function clearInterest(pieceId: string) {
    const { error } = await supabase
      .from("modern_interest")
      .delete()
      .eq("piece_id", pieceId);
    if (error) loadAll();
    else setInterest((r) => r.filter((x) => x.piece_id !== pieceId));
  }

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

  if (loading) {
    return (
      <p className="mono" style={{ opacity: 0.7 }}>
        Loading the collection…
      </p>
    );
  }

  return (
    <div className="admin">
      <div className="admin-bar mono">
        <span>Signed in as {email}</span>
        <button className="enquire" onClick={signOut} type="button">
          Sign out
        </button>
      </div>

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
                  onClick={() => deleteEnquiry(en.id)}
                >
                  Clear
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-section">
        <h2 className="admin-h">Interest</h2>
        {interestByPiece.length === 0 ? (
          <p className="mono" style={{ opacity: 0.6 }}>
            No one has registered interest yet.
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
                  onClick={() => clearInterest(g.pieceId)}
                >
                  Clear
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

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
          <PieceForm
            supabase={supabase}
            categories={categories}
            onDone={() => {
              setEditing(null);
              loadAll();
            }}
          />
        ) : null}

        <ul className="admin-list">
          {pieces.map((piece) => (
            <li key={piece.id} className="admin-piece">
              <div className="admin-piece-row">
                <div>
                  <span className="mono" style={{ opacity: 0.6 }}>
                    {piece.status}
                    {piece.placeholder ? " · placeholder" : ""}
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
                <PieceForm
                  supabase={supabase}
                  categories={categories}
                  piece={piece}
                  provenance={provenance.filter((r) => r.piece_id === piece.id)}
                  images={images.filter((r) => r.piece_id === piece.id)}
                  onDone={() => {
                    setEditing(null);
                    loadAll();
                  }}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

type SupabaseClient = ReturnType<typeof createClient>;

function PieceForm({
  supabase,
  categories,
  piece,
  provenance = [],
  images = [],
  onDone,
}: {
  supabase: SupabaseClient;
  categories: AdminCategory[];
  piece?: AdminPiece;
  provenance?: AdminProvenance[];
  images?: AdminImage[];
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    slug: piece?.slug ?? "",
    category_id: piece?.category_id ?? categories[0]?.id ?? "",
    title: piece?.title ?? "",
    attribution: piece?.attribution ?? "",
    period_label: piece?.period_label ?? "",
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
  const [rows, setRows] = useState<
    { id?: string; label: string; detail: string }[]
  >(provenance.map((r) => ({ id: r.id, label: r.label, detail: r.detail })));
  const [imgRows, setImgRows] = useState<
    { id?: string; path: string; alt: string; kind: ImageKind }[]
  >(images.map((r) => ({ id: r.id, path: r.path, alt: r.alt, kind: r.kind })));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        slug: form.slug.trim(),
        category_id: form.category_id,
        title: form.title.trim(),
        attribution: form.attribution.trim(),
        period_label: form.period_label.trim(),
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
            : Math.round(Number(form.price.trim().replace(/[^0-9.]/g, "")) * 100),
        placeholder: form.placeholder,
        featured: form.featured,
        featured_position:
          form.featured && form.featured_position.trim()
            ? Math.round(Number(form.featured_position.trim()))
            : null,
        provenance_verified: form.provenance_verified,
        story: form.story.trim(),
        restoration_notes: form.restoration_notes.trim(),
      };

      let pieceId = piece?.id;
      if (piece) {
        const { error } = await supabase
          .from("modern_pieces")
          .update(payload as never)
          .eq("id", piece.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("modern_pieces")
          .insert(payload as never)
          .select("id")
          .single();
        if (error) throw error;
        pieceId = (data as { id: string } | null)?.id;
      }
      if (!pieceId) throw new Error("Could not save the piece.");

      // Replace provenance and images with the edited set. Errors are surfaced
      // (and the form keeps its state) so a failed write is visible and can be
      // retried rather than silently losing the rows.
      const provDel = await supabase
        .from("modern_provenance")
        .delete()
        .eq("piece_id", pieceId);
      if (provDel.error) throw provDel.error;
      if (rows.length) {
        const { error } = await supabase.from("modern_provenance").insert(
          rows.map((r, i) => ({
            piece_id: pieceId,
            position: i + 1,
            label: r.label.trim(),
            detail: r.detail.trim(),
          })) as never,
        );
        if (error) throw error;
      }
      const imgDel = await supabase
        .from("modern_piece_images")
        .delete()
        .eq("piece_id", pieceId);
      if (imgDel.error) throw imgDel.error;
      if (imgRows.length) {
        const { error } = await supabase.from("modern_piece_images").insert(
          imgRows.map((r, i) => ({
            piece_id: pieceId,
            position: i + 1,
            path: r.path.trim(),
            alt: r.alt.trim(),
            kind: r.kind,
          })) as never,
        );
        if (error) throw error;
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form className="form admin-form" onSubmit={save}>
      <div className="field">
        <label>Title</label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required />
      </div>
      <div className="field">
        <label>Slug (url)</label>
        <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
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
      <label className="mono" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
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
      <label className="mono" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.placeholder}
          onChange={(e) => set("placeholder", e.target.checked)}
        />
        Placeholder listing (details unconfirmed)
      </label>
      <label className="mono" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.provenance_verified}
          onChange={(e) => set("provenance_verified", e.target.checked)}
        />
        Provenance verified (show the seal)
      </label>
      <label className="mono" style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => set("featured", e.target.checked)}
        />
        Feature on the homepage
      </label>
      {form.featured ? (
        <div className="field">
          <label>Homepage position (lower shows first)</label>
          <input
            inputMode="numeric"
            value={form.featured_position}
            onChange={(e) => set("featured_position", e.target.value)}
            placeholder="1"
          />
        </div>
      ) : null}

      <fieldset className="admin-fieldset">
        <legend className="mono">Provenance rings</legend>
        {rows.map((r, i) => (
          <div key={i} className="admin-subrow">
            <input
              placeholder="Label, e.g. Found"
              value={r.label}
              onChange={(e) =>
                setRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                )
              }
            />
            <input
              placeholder="Detail"
              value={r.detail}
              onChange={(e) =>
                setRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)),
                )
              }
            />
            <button
              type="button"
              className="enquire"
              onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="enquire"
          onClick={() => setRows((rs) => [...rs, { label: "", detail: "" }])}
        >
          Add provenance
        </button>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="mono">Images</legend>
        {imgRows.map((r, i) => (
          <div key={i} className="admin-subrow">
            <input
              placeholder="Path or URL"
              value={r.path}
              onChange={(e) =>
                setImgRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, path: e.target.value } : x)),
                )
              }
            />
            <input
              placeholder="Alt text"
              value={r.alt}
              onChange={(e) =>
                setImgRows((rs) =>
                  rs.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)),
                )
              }
            />
            <select
              value={r.kind}
              onChange={(e) =>
                setImgRows((rs) =>
                  rs.map((x, j) =>
                    j === i ? { ...x, kind: e.target.value as ImageKind } : x,
                  ),
                )
              }
            >
              {IMAGE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="enquire"
              onClick={() => setImgRows((rs) => rs.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="enquire"
          onClick={() =>
            setImgRows((rs) => [...rs, { path: "", alt: "", kind: "detail" }])
          }
        >
          Add image
        </button>
      </fieldset>

      <button className="enquire" type="submit" disabled={busy}>
        {busy ? "Saving" : piece ? "Save changes" : "Create piece"}
      </button>
      {error ? (
        <p className="form-note mono" data-tone="error">
          {error}
        </p>
      ) : null}
    </form>
  );
}

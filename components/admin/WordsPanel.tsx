"use client";

import { useState } from "react";
import type { AdminPiece, AdminWord } from "@/components/admin/types";

/**
 * Collector words, staff curated. Site-wide words appear on the home page
 * and top up piece pages; words tied to a piece show on that piece alone.
 * Everything goes through /api/admin/words, one entry at a time.
 */

export default function WordsPanel({
  words,
  pieces,
  onReload,
}: {
  words: AdminWord[];
  pieces: AdminPiece[];
  onReload: () => void;
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const titles = new Map(pieces.map((p) => [p.id, p.title]));

  // Site-wide first, then per piece, each in position order.
  const sorted = [...words].sort((a, b) => {
    if ((a.piece_id === null) !== (b.piece_id === null)) {
      return a.piece_id === null ? -1 : 1;
    }
    return a.position - b.position;
  });

  async function remove(id: string) {
    await fetch(`/api/admin/words?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setEditing(null);
    onReload();
  }

  const done = () => {
    setEditing(null);
    onReload();
  };

  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2 className="admin-h">Collector words</h2>
        <button
          className="enquire"
          type="button"
          onClick={() => setEditing(editing === "new" ? null : "new")}
        >
          {editing === "new" ? "Close" : "New words"}
        </button>
      </div>

      {editing === "new" ? (
        <WordForm pieces={pieces} nextPosition={words.length + 1} onDone={done} />
      ) : null}

      {sorted.length === 0 ? (
        <p className="mono" style={{ opacity: 0.6 }}>
          No collector words yet.
        </p>
      ) : (
        <ul className="admin-list">
          {sorted.map((w) => (
            <li key={w.id} className="admin-piece">
              <div className="admin-piece-row">
                <div>
                  <span className="mono" style={{ opacity: 0.6 }}>
                    {w.piece_id
                      ? titles.get(w.piece_id) ?? "Unknown piece"
                      : "Site-wide"}
                    {" · "}
                    {w.published ? "published" : "hidden"}
                  </span>
                  <p>
                    <strong>{w.quote}</strong>
                  </p>
                  <p style={{ opacity: 0.7 }}>
                    {w.name}
                    {w.context ? `, ${w.context}` : ""}
                  </p>
                </div>
                <div className="admin-piece-actions mono">
                  <button
                    className="enquire"
                    type="button"
                    onClick={() => setEditing(editing === w.id ? null : w.id)}
                  >
                    {editing === w.id ? "Close" : "Edit"}
                  </button>
                  <button
                    className="enquire"
                    type="button"
                    onClick={() => remove(w.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              {editing === w.id ? (
                <WordForm
                  pieces={pieces}
                  word={w}
                  nextPosition={words.length + 1}
                  onDone={done}
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function WordForm({
  pieces,
  word,
  nextPosition,
  onDone,
}: {
  pieces: AdminPiece[];
  word?: AdminWord;
  nextPosition: number;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    piece_id: word?.piece_id ?? "",
    quote: word?.quote ?? "",
    name: word?.name ?? "",
    context: word?.context ?? "",
    position: String(word?.position ?? nextPosition),
    published: word?.published ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: word?.id,
          piece_id: form.piece_id || null,
          quote: form.quote.trim(),
          name: form.name.trim(),
          context: form.context.trim(),
          position: form.position.trim()
            ? Math.round(Number(form.position.trim()))
            : 0,
          published: form.published,
        }),
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

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form className="form admin-form" onSubmit={save}>
      <div className="field">
        <label>Piece (leave site-wide for the home page)</label>
        <select
          value={form.piece_id}
          onChange={(e) => set("piece_id", e.target.value)}
        >
          <option value="">Site-wide</option>
          {pieces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Quote</label>
        <textarea
          value={form.quote}
          onChange={(e) => set("quote", e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label>Name (kept anonymous in the house style)</label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="A collector"
        />
      </div>
      <div className="field">
        <label>Context</label>
        <input
          value={form.context}
          onChange={(e) => set("context", e.target.value)}
          placeholder="Ball chair, rehomed to Edinburgh"
        />
      </div>
      <div className="field">
        <label>Position (lower shows first)</label>
        <input
          inputMode="numeric"
          value={form.position}
          onChange={(e) => set("position", e.target.value)}
        />
      </div>
      <label className="admin-check mono">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        Published
      </label>
      <button className="enquire" type="submit" disabled={busy}>
        {busy ? "Saving" : word ? "Save changes" : "Add the words"}
      </button>
      {error ? (
        <p className="form-note mono" data-tone="error" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}

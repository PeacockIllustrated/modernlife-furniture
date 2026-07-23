"use client";

import { useState } from "react";
import type { AdminFaq } from "@/components/admin/types";

/**
 * Site-wide questions, the shared half of every piece page's questions
 * section. Questions belonging to a single piece are edited on the piece
 * itself; this panel only ever sees rows with a null piece_id.
 */

export default function QuestionsPanel({
  faqs,
  onReload,
}: {
  faqs: AdminFaq[];
  onReload: () => void;
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const siteWide = faqs
    .filter((f) => f.piece_id === null)
    .sort((a, b) => a.position - b.position);

  async function remove(id: string) {
    await fetch(`/api/admin/questions?id=${encodeURIComponent(id)}`, {
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
        <h2 className="admin-h">Questions</h2>
        <button
          className="enquire"
          type="button"
          onClick={() => setEditing(editing === "new" ? null : "new")}
        >
          {editing === "new" ? "Close" : "New question"}
        </button>
      </div>
      <p className="admin-hint">
        These appear on every piece page, after any questions belonging to the
        piece itself. Per-piece questions are edited on the piece.
      </p>

      {editing === "new" ? (
        <QuestionForm nextPosition={siteWide.length + 1} onDone={done} />
      ) : null}

      {siteWide.length === 0 ? (
        <p className="mono" style={{ opacity: 0.6 }}>
          No site-wide questions yet.
        </p>
      ) : (
        <ul className="admin-list">
          {siteWide.map((q) => (
            <li key={q.id} className="admin-piece">
              <div className="admin-piece-row">
                <div>
                  <span className="mono" style={{ opacity: 0.6 }}>
                    {q.published ? "published" : "hidden"}
                  </span>
                  <p>
                    <strong>{q.question}</strong>
                  </p>
                  <p style={{ opacity: 0.7 }}>{q.answer}</p>
                </div>
                <div className="admin-piece-actions mono">
                  <button
                    className="enquire"
                    type="button"
                    onClick={() => setEditing(editing === q.id ? null : q.id)}
                  >
                    {editing === q.id ? "Close" : "Edit"}
                  </button>
                  <button
                    className="enquire"
                    type="button"
                    onClick={() => remove(q.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              {editing === q.id ? (
                <QuestionForm
                  question={q}
                  nextPosition={siteWide.length + 1}
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

function QuestionForm({
  question,
  nextPosition,
  onDone,
}: {
  question?: AdminFaq;
  nextPosition: number;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    question: question?.question ?? "",
    answer: question?.answer ?? "",
    position: String(question?.position ?? nextPosition),
    published: question?.published ?? true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: question?.id,
          question: form.question.trim(),
          answer: form.answer.trim(),
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
        <label>Question (no question mark needed)</label>
        <input
          value={form.question}
          onChange={(e) => set("question", e.target.value)}
          placeholder="How does buying work"
          required
        />
      </div>
      <div className="field">
        <label>Answer</label>
        <textarea
          value={form.answer}
          onChange={(e) => set("answer", e.target.value)}
          required
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
        {busy ? "Saving" : question ? "Save changes" : "Add the question"}
      </button>
      {error ? (
        <p className="form-note mono" data-tone="error" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}

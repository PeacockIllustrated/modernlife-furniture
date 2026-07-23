"use client";

import { useState } from "react";

/**
 * The acquisitions list form in the footer. A single email field posting to
 * /api/subscribe, which rate limits and accepts gracefully when no database is
 * configured, so joining never dead-ends a reader. On success the field folds
 * away and only the confirmation remains. The status note is always in the
 * document so screen readers hear the change announced.
 */
export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [note, setNote] = useState("");
  const fallbackNote = "We could not note that just now, email us instead.";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) {
      setStatus("error");
      setNote("Add your email address first.");
      return;
    }
    setStatus("sending");
    setNote("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        // The server refuses in one human sentence; show it when it has one.
        const json = await res.json().catch(() => ({}));
        setStatus("error");
        setNote(
          typeof json.error === "string" && json.error
            ? json.error
            : fallbackNote,
        );
      }
    } catch {
      setStatus("error");
      setNote(fallbackNote);
    }
  }

  return (
    <form className="news-form" onSubmit={onSubmit} noValidate>
      {status === "ok" ? null : (
        <div className="news-row">
          <input
            id="news-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-label="Email for the acquisitions list"
            required
          />
          <button
            className="enquire"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Joining" : "Join the list"}
          </button>
        </div>
      )}
      <p
        className="form-note mono"
        role="status"
        data-tone={
          status === "ok" ? "ok" : status === "error" ? "error" : undefined
        }
      >
        {status === "ok"
          ? "You are on the list."
          : status === "error"
            ? note || fallbackNote
            : ""}
      </p>
    </form>
  );
}

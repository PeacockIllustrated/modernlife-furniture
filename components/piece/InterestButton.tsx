"use client";

import { useState } from "react";

/**
 * "I want this": a lightweight expression of interest against a piece. A single
 * press registers the interest; the visitor may optionally leave an email so the
 * owner can follow up. Posts to /api/interest, which rolls the counts up per
 * piece in the dashboard. Accepted gracefully with no database configured.
 */
export default function InterestButton({ pieceSlug }: { pieceSlug: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [note, setNote] = useState("");

  async function register(email: string | null) {
    if (status === "sending") return;
    setStatus("sending");
    setNote("");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieceSlug, email }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus("ok");
        setNote(
          email
            ? "Noted, thank you. We will be in touch when there is news of this piece."
            : "Noted, thank you. Your interest has been registered.",
        );
      } else {
        setStatus("error");
        setNote(json.error ?? "We could not note that just now.");
      }
    } catch {
      setStatus("error");
      setNote("We could not note that just now.");
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    register(email || null);
  }

  if (status === "ok") {
    return (
      <p className="interest-done mono" role="status">
        {note}
      </p>
    );
  }

  return (
    <div className="interest">
      {open ? (
        <form className="interest-form" onSubmit={onSubmit} noValidate>
          <p className="mono interest-lead">
            Leave an email and we will tell you when this piece moves, or press
            register to note your interest without one.
          </p>
          <div className="interest-row">
            <input
              id="interest-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-label="Email, optional"
            />
            <button
              className="enquire"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Noting" : "Register interest"}
            </button>
          </div>
          {note ? (
            <p className="form-note mono" data-tone="error" role="status">
              {note}
            </p>
          ) : null}
        </form>
      ) : (
        <button
          className="interest-open mono"
          type="button"
          onClick={() => setOpen(true)}
        >
          I want this
        </button>
      )}
    </div>
  );
}

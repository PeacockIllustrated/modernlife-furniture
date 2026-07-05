"use client";

import { useState } from "react";
import type { EnquiryKind } from "@/lib/supabase/types";

const KIND_LABELS: Record<EnquiryKind, string> = {
  piece: "About a piece",
  restoration: "Restoration",
  sourcing: "Find me something",
  selling: "I have a piece to sell",
};

const MAILTO = "mailto:studio@modernlifefurniture.co.uk";

/**
 * The enquiry form. Posts to /api/enquire, which rate limits and writes to
 * mlf_enquiries. A mailto fallback is always offered, per CONTENT.md, so an
 * enquiry is never lost if the database is unreachable.
 */
export default function EnquiryForm({
  defaultKind = "piece",
  pieceSlug,
  pieceTitle,
}: {
  defaultKind?: EnquiryKind;
  pieceSlug?: string;
  pieceTitle?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setNote("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          kind: data.get("kind"),
          pieceSlug: pieceSlug ?? null,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus("ok");
        setNote(
          json.note ??
            "Thank you. We have your note and will reply as soon as we can.",
        );
        form.reset();
      } else {
        setStatus("error");
        setNote(json.error ?? "Something went wrong. Please email us instead.");
      }
    } catch {
      setStatus("error");
      setNote("Something went wrong. Please email us instead.");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {pieceTitle ? (
        <input type="hidden" name="pieceTitle" value={pieceTitle} />
      ) : null}

      <div className="field">
        <label htmlFor="kind">Enquiry</label>
        <select id="kind" name="kind" defaultValue={defaultKind}>
          {(Object.keys(KIND_LABELS) as EnquiryKind[]).map((k) => (
            <option key={k} value={k}>
              {KIND_LABELS[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          required
          defaultValue={
            pieceTitle ? `I am interested in the ${pieceTitle}. ` : ""
          }
        />
      </div>

      <button className="enquire" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending" : "Send enquiry"}
      </button>

      {note ? (
        <p
          className="form-note mono"
          data-tone={status === "ok" ? "ok" : status === "error" ? "error" : undefined}
          role="status"
        >
          {note}
        </p>
      ) : null}

      <p className="form-note mono">
        Or write to us directly at{" "}
        <a href={MAILTO}>studio@modernlifefurniture.co.uk</a>
      </p>
    </form>
  );
}

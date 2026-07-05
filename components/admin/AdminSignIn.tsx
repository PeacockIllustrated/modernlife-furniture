"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Owner sign-in by magic link. No passwords: the owner enters their email and
 * follows the link back to the dashboard.
 */
export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setSent(true);
    } catch {
      setError("Could not send the link just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p className="form-note mono" data-tone="ok" role="status">
        Check your email for a sign-in link.
      </p>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="admin-email">Owner email</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button className="enquire" type="submit" disabled={busy}>
        {busy ? "Sending" : "Send sign-in link"}
      </button>
      {error ? (
        <p className="form-note mono" data-tone="error" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}

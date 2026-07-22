"use client";

import { useState } from "react";

/**
 * Owner sign-in with a username and password, a simple stand-in for full auth.
 * Posts to /api/admin/login, which sets a signed session cookie; a reload then
 * lands on the dashboard.
 */
export default function AdminLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Could not sign in just now.");
        setBusy(false);
      }
    } catch {
      setError("Could not sign in just now.");
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="admin-user">Username</label>
        <input
          id="admin-user"
          name="username"
          type="text"
          autoComplete="username"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="admin-pass">Password</label>
        <input
          id="admin-pass"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <button className="enquire" type="submit" disabled={busy}>
        {busy ? "Signing in" : "Sign in"}
      </button>
      {error ? (
        <p className="form-note mono" data-tone="error" role="status">
          {error}
        </p>
      ) : null}
    </form>
  );
}

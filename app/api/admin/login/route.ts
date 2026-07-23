import { NextResponse } from "next/server";
import {
  adminConfigured,
  verifyCredentials,
  issueSession,
  sessionCookie,
  clearedCookie,
} from "@/lib/admin/auth";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Sign in with the owner username and password, setting the session cookie. */
export async function POST(req: Request) {
  if (!adminConfigured) {
    return NextResponse.json(
      { error: "The dashboard is not configured yet." },
      { status: 503 },
    );
  }
  // Ten attempts in ten minutes per client, so the password cannot be
  // guessed at speed while the owner can still mistype a few times.
  const limit = rateLimit("login:" + clientKey(req), 10, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  if (!username || !password) {
    return NextResponse.json(
      { error: "Enter your username and password." },
      { status: 400 },
    );
  }
  if (!verifyCredentials(username, password)) {
    // Pause on failure so automated guessing stays slow even if the in-memory limiter resets.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json(
      { error: "Those details were not recognised." },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(issueSession()));
  return res;
}

/** Sign out, clearing the session cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearedCookie());
  return res;
}

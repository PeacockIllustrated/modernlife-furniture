import { NextResponse } from "next/server";
import {
  adminConfigured,
  verifyCredentials,
  issueSession,
  sessionCookie,
  clearedCookie,
} from "@/lib/admin/auth";

export const runtime = "nodejs";

/** Sign in with the owner username and password, setting the session cookie. */
export async function POST(req: Request) {
  if (!adminConfigured) {
    return NextResponse.json(
      { error: "The dashboard is not configured yet." },
      { status: 503 },
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

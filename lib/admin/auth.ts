import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Simple username and password gate for the owner dashboard, a deliberate
 * stand-in for full Supabase Auth "just for now". Credentials live in the
 * environment; a signed, httpOnly cookie carries the session. Dashboard reads
 * and writes then go through server routes using the service role, so no
 * Supabase Auth session is needed.
 *
 *   ADMIN_USER            the owner's username
 *   ADMIN_PASSWORD        the owner's password
 *   ADMIN_SESSION_SECRET  optional signing secret; falls back to the password
 */

const ADMIN_USER = process.env.ADMIN_USER ?? "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SECRET = process.env.ADMIN_SESSION_SECRET || ADMIN_PASSWORD;

export const COOKIE = "modern_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // seven days

/** Whether the gate is configured. Without it the admin shows setup guidance. */
export const adminConfigured = Boolean(ADMIN_USER && ADMIN_PASSWORD);

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Constant-time check of the submitted credentials. */
export function verifyCredentials(user: string, password: string): boolean {
  if (!adminConfigured) return false;
  // Evaluate both so the comparison time does not leak which field was wrong.
  const okUser = safeEqual(user, ADMIN_USER);
  const okPass = safeEqual(password, ADMIN_PASSWORD);
  return okUser && okPass;
}

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/** Issue a signed session token that expires in seven days. */
export function issueSession(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ u: ADMIN_USER, exp })).toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

/** Verify a session token's signature and expiry. */
export function verifySession(token: string | undefined): boolean {
  if (!token || !adminConfigured) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!safeEqual(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** True when the current request carries a valid admin session cookie. */
export async function isSignedIn(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(COOKIE)?.value);
}

export const sessionCookie = (value: string) => ({
  name: COOKIE,
  value,
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE,
});

export const clearedCookie = () => ({
  name: COOKIE,
  value: "",
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
});

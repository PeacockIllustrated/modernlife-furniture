import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { rateLimit } from "@/lib/rateLimit";
import { notifyOwner } from "@/lib/email";
import type { Database } from "@/lib/supabase/types";

/**
 * The acquisitions list: a single email from the footer form, stored in
 * modern_subscribers. Rate limited, and accepted gracefully when no database
 * is configured. An address already on the list is treated as success rather
 * than an error, because the reader's intent is met either way.
 */

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" && body.email.trim()
      ? body.email.trim()
      : null;

  if (!email) {
    return NextResponse.json(
      { error: "No email address given." },
      { status: 400 },
    );
  }
  if (email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const limit = rateLimit("subscribe:" + clientKey(req));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Noted already. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const payload: Database["public"]["Tables"]["modern_subscribers"]["Insert"] = {
      email,
    };
    const { error } = await supabase
      .from("modern_subscribers")
      .insert(payload as never);
    if (error) {
      // A unique violation means the address is already on the list, which is
      // what the reader wanted; report success and do not trouble the owner.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, stored: true });
      }
      return NextResponse.json(
        { error: "We could not note that just now." },
        { status: 502 },
      );
    }
    await notifyOwner("New name for the acquisitions list", [
      `Email: ${email}`,
    ]);
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json(
      { error: "We could not note that just now." },
      { status: 502 },
    );
  }
}

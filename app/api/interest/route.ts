import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { rateLimit } from "@/lib/rateLimit";
import { notifyOwner } from "@/lib/email";
import type { Database } from "@/lib/supabase/types";

/**
 * "I want this": a lightweight expression of interest against a piece, with an
 * optional email so the owner can follow up. Stored in mlf_interest and rolled
 * up per piece in the dashboard. Rate limited, and accepted gracefully when no
 * database is configured.
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

  const pieceSlug =
    typeof body.pieceSlug === "string" && body.pieceSlug ? body.pieceSlug : null;
  const email =
    typeof body.email === "string" && body.email.trim()
      ? body.email.trim()
      : null;

  if (!pieceSlug) {
    return NextResponse.json({ error: "No piece given." }, { status: 400 });
  }
  if (email && (email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const limit = rateLimit("interest:" + clientKey(req));
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

    const { data: piece } = await supabase
      .from("mlf_pieces")
      .select("id")
      .eq("slug", pieceSlug)
      .maybeSingle();
    const pieceId = (piece as { id: string } | null)?.id ?? null;
    if (!pieceId) {
      return NextResponse.json({ error: "Piece not found." }, { status: 404 });
    }

    const payload: Database["public"]["Tables"]["mlf_interest"]["Insert"] = {
      piece_id: pieceId,
      email,
    };
    const { error } = await supabase
      .from("mlf_interest")
      .insert(payload as never);
    if (error) {
      return NextResponse.json(
        { error: "We could not note that just now." },
        { status: 502 },
      );
    }
    await notifyOwner(`Interest registered in ${pieceSlug}`, [
      `Piece: ${pieceSlug}`,
      `Email: ${email ?? "not left"}`,
    ]);
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json(
      { error: "We could not note that just now." },
      { status: 502 },
    );
  }
}

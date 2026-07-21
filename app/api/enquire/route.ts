import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { rateLimit } from "@/lib/rateLimit";
import { notifyOwner } from "@/lib/email";
import type { Database, EnquiryKind } from "@/lib/supabase/types";

const KINDS: EnquiryKind[] = ["piece", "restoration", "sourcing", "selling"];

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

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const kind = (
    KINDS.includes(body.kind as EnquiryKind) ? body.kind : "piece"
  ) as EnquiryKind;
  const pieceSlug =
    typeof body.pieceSlug === "string" && body.pieceSlug ? body.pieceSlug : null;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please give your name, email and a short message." },
      { status: 400 },
    );
  }
  if (name.length > 200 || email.length > 320) {
    return NextResponse.json(
      { error: "That name or email is too long." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email address does not look right." },
      { status: 400 },
    );
  }
  if (message.length > 4000) {
    return NextResponse.json(
      { error: "That message is a little long; please trim it." },
      { status: 400 },
    );
  }

  // Rate limit per client. Production can move this to a Supabase edge function
  // backed by a shared store; the interface stays the same.
  const limit = rateLimit(clientKey(req));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Thank you, we have your note. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  // Without a database, accept gracefully and point at the mailto fallback.
  if (!isSupabaseConfigured) {
    return NextResponse.json({
      ok: true,
      stored: false,
      note: "Your enquiry was received. Email studio@modernlifefurniture.co.uk if you would like a faster reply.",
    });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    let pieceId: string | null = null;
    if (pieceSlug) {
      const { data } = await supabase
        .from("modern_pieces")
        .select("id")
        .eq("slug", pieceSlug)
        .maybeSingle();
      pieceId = (data as { id: string } | null)?.id ?? null;
    }

    // The payload is type-checked against the Insert type; the insert call is
    // asserted because the hand-written Database types do not satisfy
    // postgrest 2.110's builder generics (regenerate with the Supabase CLI once
    // a project is provisioned to restore full inference).
    const payload: Database["public"]["Tables"]["modern_enquiries"]["Insert"] = {
      piece_id: pieceId,
      name,
      email,
      message,
      kind,
    };
    const { error } = await supabase
      .from("modern_enquiries")
      .insert(payload as never);
    if (error) {
      return NextResponse.json(
        { error: "We could not record that just now. Please email us instead." },
        { status: 502 },
      );
    }
    await notifyOwner(`New ${kind} enquiry from ${name}`, [
      `Kind: ${kind}`,
      pieceSlug ? `Piece: ${pieceSlug}` : "Piece: not specified",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      message,
    ]);
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json(
      { error: "We could not record that just now. Please email us instead." },
      { status: 502 },
    );
  }
}

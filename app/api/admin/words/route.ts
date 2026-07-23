import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Collector words, staff curated. A null piece_id marks site-wide words shown
 * on the home page and topped up on piece pages; a piece_id ties the words to
 * one piece. POST upserts a single entry, DELETE removes one. Gated.
 */

interface WordPayload {
  id?: string;
  piece_id: string | null;
  quote: string;
  name: string;
  context: string;
  position: number;
  published: boolean;
}

async function guard() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }
  return null;
}

export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: WordPayload;
  try {
    body = (await req.json()) as WordPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const quote = typeof body.quote === "string" ? body.quote.trim() : "";
  if (!quote) {
    return NextResponse.json(
      { error: "Collector words need a quote." },
      { status: 400 },
    );
  }
  const row = {
    piece_id:
      typeof body.piece_id === "string" && body.piece_id ? body.piece_id : null,
    quote,
    name: typeof body.name === "string" ? body.name.trim() : "",
    context: typeof body.context === "string" ? body.context.trim() : "",
    position: Number.isFinite(Number(body.position))
      ? Math.round(Number(body.position))
      : 0,
    published: Boolean(body.published ?? true),
  };

  const db = createAdminClient();
  if (body.id) {
    const { error } = await db
      .from("modern_testimonials")
      .update(row as never)
      .eq("id", body.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ ok: true, id: body.id });
  }
  const { data, error } = await db
    .from("modern_testimonials")
    .insert(row as never)
    .select("id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id: (data as { id: string }).id });
}

export async function DELETE(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "No entry given." }, { status: 400 });
  }
  const db = createAdminClient();
  const { error } = await db.from("modern_testimonials").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

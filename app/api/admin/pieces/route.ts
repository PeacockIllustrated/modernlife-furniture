import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";
import type { PieceStatus, ImageKind } from "@/lib/supabase/types";

export const runtime = "nodejs";

interface PiecePayload {
  id?: string;
  piece: {
    slug: string;
    category_id: string;
    title: string;
    attribution: string;
    period_label: string;
    year_from: number | null;
    year_to: number | null;
    origin: string;
    materials: string[];
    status: PieceStatus;
    price_on_request: boolean;
    price_pence: number | null;
    placeholder: boolean;
    featured: boolean;
    featured_position: number | null;
    provenance_verified: boolean;
    story: string;
    restoration_notes: string;
  };
  provenance: { label: string; detail: string }[];
  images: { path: string; alt: string; kind: ImageKind }[];
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

/** Create or update a piece, replacing its provenance and images. Gated. */
export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  let body: PiecePayload;
  try {
    body = (await req.json()) as PiecePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.piece?.slug || !body.piece?.title || !body.piece?.category_id) {
    return NextResponse.json(
      { error: "A piece needs a title, slug and category." },
      { status: 400 },
    );
  }

  const db = createAdminClient();
  let pieceId = body.id;

  if (pieceId) {
    const { error } = await db
      .from("modern_pieces")
      .update(body.piece as never)
      .eq("id", pieceId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
  } else {
    const { data, error } = await db
      .from("modern_pieces")
      .insert(body.piece as never)
      .select("id")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    pieceId = (data as { id: string } | null)?.id;
  }
  if (!pieceId) {
    return NextResponse.json(
      { error: "Could not save the piece." },
      { status: 502 },
    );
  }

  // Replace provenance and images with the edited set.
  const provDel = await db
    .from("modern_provenance")
    .delete()
    .eq("piece_id", pieceId);
  if (provDel.error) {
    return NextResponse.json({ error: provDel.error.message }, { status: 502 });
  }
  if (body.provenance?.length) {
    const { error } = await db.from("modern_provenance").insert(
      body.provenance.map((r, i) => ({
        piece_id: pieceId,
        position: i + 1,
        label: r.label.trim(),
        detail: r.detail.trim(),
      })) as never,
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
  }

  const imgDel = await db
    .from("modern_piece_images")
    .delete()
    .eq("piece_id", pieceId);
  if (imgDel.error) {
    return NextResponse.json({ error: imgDel.error.message }, { status: 502 });
  }
  if (body.images?.length) {
    const { error } = await db.from("modern_piece_images").insert(
      body.images.map((r, i) => ({
        piece_id: pieceId,
        position: i + 1,
        path: r.path.trim(),
        alt: r.alt.trim(),
        kind: r.kind,
      })) as never,
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, id: pieceId });
}

/** Delete a piece (provenance and images cascade). Gated. */
export async function DELETE(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "No piece given." }, { status: 400 });
  }
  const db = createAdminClient();
  const { error } = await db.from("modern_pieces").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

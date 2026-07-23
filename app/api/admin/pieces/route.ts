import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";
import type {
  PieceStatus,
  ImageKind,
  FeatureLayout,
} from "@/lib/supabase/types";

export const runtime = "nodejs";

interface PiecePayload {
  id?: string;
  piece: {
    slug: string;
    category_id: string;
    title: string;
    attribution: string;
    period_label: string;
    catalogue_number: string;
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
    section_toggles: Record<string, boolean>;
  };
  provenance: { label: string; detail: string }[];
  images: { path: string; alt: string; kind: ImageKind }[];
  features: {
    eyebrow: string;
    title: string;
    body: string;
    image_path: string;
    image_alt: string;
    layout: FeatureLayout;
  }[];
  specs: { grouping: string; term: string; detail: string }[];
  included: { label: string; note: string }[];
  faqs: { question: string; answer: string; published: boolean }[];
}

const LAYOUTS: FeatureLayout[] = ["left", "right", "full"];
const KINDS: ImageKind[] = ["hero", "detail", "as_found", "restored"];

// Trim free text defensively; a malformed row should read as empty, not throw.
const clean = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

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

type ChildTable =
  | "modern_provenance"
  | "modern_piece_images"
  | "modern_piece_features"
  | "modern_piece_specs"
  | "modern_piece_included"
  | "modern_faqs";

// Children are replaced wholesale on every save: delete the piece's rows,
// reinsert the edited set with positions following row order. Scoping the
// delete to piece_id means site-wide questions (piece_id null) are never
// touched from here.
async function replaceChildRows(
  db: ReturnType<typeof createAdminClient>,
  table: ChildTable,
  pieceId: string,
  rows: Record<string, unknown>[],
): Promise<string | null> {
  const del = await db.from(table).delete().eq("piece_id", pieceId);
  if (del.error) return del.error.message;
  if (rows.length === 0) return null;
  const ins = await db.from(table).insert(rows as never);
  if (ins.error) return ins.error.message;
  return null;
}

/** Create or update a piece, replacing all of its child rows. Gated. */
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
  const id = pieceId;

  const children: [ChildTable, Record<string, unknown>[]][] = [
    [
      "modern_provenance",
      (body.provenance ?? []).map((r, i) => ({
        piece_id: id,
        position: i + 1,
        label: clean(r.label),
        detail: clean(r.detail),
      })),
    ],
    [
      "modern_piece_images",
      (body.images ?? []).map((r, i) => ({
        piece_id: id,
        position: i + 1,
        path: clean(r.path),
        alt: clean(r.alt),
        kind: KINDS.includes(r.kind) ? r.kind : "detail",
      })),
    ],
    [
      "modern_piece_features",
      (body.features ?? []).map((r, i) => ({
        piece_id: id,
        position: i + 1,
        eyebrow: clean(r.eyebrow),
        title: clean(r.title),
        body: clean(r.body),
        image_path: clean(r.image_path),
        image_alt: clean(r.image_alt),
        layout: LAYOUTS.includes(r.layout) ? r.layout : "right",
      })),
    ],
    [
      "modern_piece_specs",
      (body.specs ?? []).map((r, i) => ({
        piece_id: id,
        position: i + 1,
        grouping: clean(r.grouping),
        term: clean(r.term),
        detail: clean(r.detail),
      })),
    ],
    [
      "modern_piece_included",
      (body.included ?? []).map((r, i) => ({
        piece_id: id,
        position: i + 1,
        label: clean(r.label),
        note: clean(r.note),
      })),
    ],
    [
      "modern_faqs",
      (body.faqs ?? []).map((r, i) => ({
        piece_id: id,
        position: i + 1,
        question: clean(r.question),
        answer: clean(r.answer),
        published: Boolean(r.published ?? true),
      })),
    ],
  ];
  for (const [table, rows] of children) {
    const failed = await replaceChildRows(db, table, id, rows);
    if (failed) {
      return NextResponse.json({ error: failed }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true, id });
}

/** Delete a piece (all child rows cascade). Gated. */
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

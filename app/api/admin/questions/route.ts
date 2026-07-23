import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Site-wide questions, the ones shown on every piece page after any questions
 * belonging to the piece itself. Rows created here always carry a null
 * piece_id; per-piece questions are edited on the piece and saved through
 * /api/admin/pieces. POST upserts one question, DELETE removes one. Gated.
 */

interface QuestionPayload {
  id?: string;
  question: string;
  answer: string;
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

  let body: QuestionPayload;
  try {
    body = (await req.json()) as QuestionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const question = typeof body.question === "string" ? body.question.trim() : "";
  const answer = typeof body.answer === "string" ? body.answer.trim() : "";
  if (!question || !answer) {
    return NextResponse.json(
      { error: "A question needs both the question and the answer." },
      { status: 400 },
    );
  }
  const row = {
    question,
    answer,
    position: Number.isFinite(Number(body.position))
      ? Math.round(Number(body.position))
      : 0,
    published: Boolean(body.published ?? true),
  };

  const db = createAdminClient();
  if (body.id) {
    // Update leaves piece_id alone so an existing row keeps its scope.
    const { error } = await db
      .from("modern_faqs")
      .update(row as never)
      .eq("id", body.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ ok: true, id: body.id });
  }
  const { data, error } = await db
    .from("modern_faqs")
    .insert({ ...row, piece_id: null } as never)
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
    return NextResponse.json({ error: "No question given." }, { status: 400 });
  }
  const db = createAdminClient();
  const { error } = await db.from("modern_faqs").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Everything the dashboard renders, read with the service role. Gated. */
export async function GET() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }
  const db = createAdminClient();
  const [c, p, pr, im, en, it] = await Promise.all([
    db.from("modern_categories").select("id,slug,name").order("position"),
    db.from("modern_pieces").select("*").order("created_at", { ascending: false }),
    db.from("modern_provenance").select("*").order("position"),
    db.from("modern_piece_images").select("*").order("position"),
    db.from("modern_enquiries").select("*").order("created_at", { ascending: false }),
    db.from("modern_interest").select("*").order("created_at", { ascending: false }),
  ]);
  const firstError =
    c.error || p.error || pr.error || im.error || en.error || it.error;
  if (firstError) {
    return NextResponse.json(
      { error: "Could not load the collection." },
      { status: 502 },
    );
  }
  return NextResponse.json({
    categories: c.data ?? [],
    pieces: p.data ?? [],
    provenance: pr.data ?? [],
    images: im.data ?? [],
    enquiries: en.data ?? [],
    interest: it.data ?? [],
  });
}

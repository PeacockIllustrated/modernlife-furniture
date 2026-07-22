import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Clear an enquiry. Gated. */
export async function DELETE(req: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "No enquiry given." }, { status: 400 });
  }
  const db = createAdminClient();
  const { error } = await db.from("modern_enquiries").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

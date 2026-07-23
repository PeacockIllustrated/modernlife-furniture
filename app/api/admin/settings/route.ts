import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin/auth";
import { adminDbConfigured, createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * The store settings object, one jsonb row keyed 'store' in modern_settings.
 * The site shallow-merges it over the static defaults in content/store.ts,
 * so only the known keys are stored and anything else is dropped. The list
 * must match StoreSettings exactly; a key missing here would be stripped on
 * every save. Gated.
 */

const KEYS = [
  "announcement",
  "deliveryProse",
  "returnsProse",
  "careProse",
  "viewingProse",
  "newsletterLead",
  "heroImage",
  "heroAlt",
  "heroHeadline",
  "workshopImage",
  "workshopAlt",
] as const;

export async function POST(req: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!adminDbConfigured) {
    return NextResponse.json(
      { error: "The database is not configured." },
      { status: 503 },
    );
  }

  let body: { value?: unknown };
  try {
    body = (await req.json()) as { value?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.value || typeof body.value !== "object") {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }
  const raw = body.value as Record<string, unknown>;
  const value: Record<string, string> = {};
  for (const key of KEYS) {
    value[key] = typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  }

  const db = createAdminClient();
  const { error } = await db
    .from("modern_settings")
    .upsert({ key: "store", value } as never);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

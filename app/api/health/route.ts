import { NextResponse } from "next/server";
import { supabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * A plain wiring report for the deployment: which database host this build is
 * pointed at, whether the keys came from the environment or the baked public
 * defaults, and whether the collection is actually readable. No secrets; the
 * host and the counts are public data. Exists so "is the site connected" is a
 * URL, not a guess.
 */
export async function GET() {
  let host = "";
  try {
    host = new URL(supabaseUrl).host;
  } catch {
    // Malformed URL; the empty host in the payload says it all.
  }
  const keysFromEnvironment = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  try {
    const { createPublicClient } = await import("@/lib/supabase/public");
    const supabase = createPublicClient();
    const { count, error } = await supabase
      .from("modern_pieces")
      .select("*", { count: "exact", head: true })
      .neq("status", "draft");
    if (error) {
      return NextResponse.json({
        ok: false,
        host,
        keysFromEnvironment,
        database: "error",
        detail: error.message,
      });
    }
    return NextResponse.json({
      ok: true,
      host,
      keysFromEnvironment,
      database: "ok",
      pieces: count ?? 0,
    });
  } catch {
    return NextResponse.json({
      ok: false,
      host,
      keysFromEnvironment,
      database: "unreachable",
    });
  }
}

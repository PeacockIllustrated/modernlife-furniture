import { NextResponse } from "next/server";
import { supabaseUrl, envValuesInUse } from "@/lib/supabase/env";

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
  // Present says the variables exist; usable says they are printable ASCII a
  // request header will accept. Present but not usable is the masked-paste
  // trap, and the site then runs on the baked public defaults.
  const environmentKeysPresent = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const keySource = envValuesInUse ? "environment" : "baked defaults";

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
        environmentKeysPresent,
        keySource,
        database: "error",
        detail: error.message,
      });
    }
    return NextResponse.json({
      ok: true,
      host,
      environmentKeysPresent,
      keySource,
      database: "ok",
      pieces: count ?? 0,
    });
  } catch {
    return NextResponse.json({
      ok: false,
      host,
      environmentKeysPresent,
      keySource,
      database: "unreachable",
    });
  }
}

import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Read-only anon client for the public catalogue. It reads no cookies, so pages
 * that use it can be statically generated and served from the edge cache
 * (revalidated on an interval) instead of rendered per request. Row level
 * security still gates what the anon role may read. Never use this for writes
 * or anything that depends on the visitor's session.
 */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

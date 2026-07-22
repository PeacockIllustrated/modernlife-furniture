import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { supabaseUrl } from "./env";

/**
 * Service-role Supabase client for the owner dashboard's server routes. It
 * bypasses row level security, so every route that uses it MUST first confirm
 * the admin session (see lib/admin/auth). Never import this into client code
 * and never expose the service role key to the browser.
 *
 *   SUPABASE_SERVICE_ROLE_KEY  the project's service role key (server only)
 */

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** Whether the dashboard's server writes can run. */
export const adminDbConfigured = Boolean(supabaseUrl && SERVICE_ROLE_KEY);

export function createAdminClient() {
  return createClient<Database>(supabaseUrl, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

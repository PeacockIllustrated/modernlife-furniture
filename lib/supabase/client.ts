"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Browser Supabase client for the admin dashboard (magic-link auth and CRUD).
 * Only instantiate when isSupabaseConfigured is true.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

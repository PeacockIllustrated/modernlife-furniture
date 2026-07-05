// Supabase configuration, read from the environment. When the keys are absent
// (local dev without a project, or a preview build) the app falls back to the
// static catalogue in content/, so the site always renders.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

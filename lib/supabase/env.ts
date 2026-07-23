// Supabase configuration. A usable environment value wins; anything else
// falls back to the public defaults below, so the site stays connected to the
// shared project even when a deployment has no keys or, worse, corrupt ones.
// The failure this guards against is real: a key pasted from a masked field
// arrives as bullet characters, satisfies a simple presence check, and then
// poisons every request header with a silent TypeError. The anon key is
// public by design, it ships in every browser bundle, and row level security
// is the real boundary. The service role key has no default here and never
// will.

const DEFAULT_SUPABASE_URL = "https://mrccvqjlpxudcbfrjfmy.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2N2cWpscHh1ZGNiZnJqZm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzQ4MTgsImV4cCI6MjA4MTIxMDgxOH0.DbCR_dkI5Gh8OgnNqBqe-0jPENyhqn9f4-iof96ZlmE";

// Usable means printable ASCII throughout: HTTP headers reject anything else,
// so a value that fails this test cannot work and is treated as absent.
export function isUsableKey(value: string | undefined): value is string {
  return Boolean(value && value.length > 20 && /^[\x21-\x7e]+$/.test(value));
}

function isUsableUrl(value: string | undefined): value is string {
  return Boolean(value && /^https:\/\/[\x21-\x7e]+$/.test(value));
}

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseUrl = isUsableUrl(envUrl) ? envUrl : DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = isUsableKey(envAnonKey)
  ? envAnonKey
  : DEFAULT_SUPABASE_ANON_KEY;

// True when the values in use came from the environment rather than the
// baked defaults; /api/health reports both facts for plain diagnosis.
export const envValuesInUse =
  isUsableUrl(envUrl) && isUsableKey(envAnonKey);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Supabase configuration. The environment wins when set; otherwise the public
// defaults below connect the site to the shared project, so a deployment with
// no environment variables still reads the live collection rather than
// silently serving the static demo catalogue. The anon key is public by
// design, it ships in every browser bundle, and row level security is the
// real boundary. The service role key has no default here and never will.

const DEFAULT_SUPABASE_URL = "https://mrccvqjlpxudcbfrjfmy.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yY2N2cWpscHh1ZGNiZnJqZm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzQ4MTgsImV4cCI6MjA4MTIxMDgxOH0.DbCR_dkI5Gh8OgnNqBqe-0jPENyhqn9f4-iof96ZlmE";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

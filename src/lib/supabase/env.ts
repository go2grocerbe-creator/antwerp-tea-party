/**
 * Whether real Supabase credentials are configured. No Supabase project exists yet for this
 * app (see docs/commerce-architecture.md) — every admin page/action checks this first and
 * renders a clear "not configured" state instead of crashing or silently doing nothing.
 */
export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set — see docs/commerce-architecture.md");
  return url;
}

export function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set — see docs/commerce-architecture.md");
  return key;
}

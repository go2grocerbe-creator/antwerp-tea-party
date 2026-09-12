import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

export function isServiceRoleConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Service-role Supabase client. Bypasses Row-Level Security entirely — server-only, never
 * import this from a Client Component, and only use it for the narrow, deliberate cases that
 * need to see beyond what RLS allows a normal session (e.g. resolving a draft product for the
 * COMMERCE_PREVIEW_TOKEN-gated preview path in supabase-provider.ts). Every other read/write
 * should go through createSupabaseServerClient() (src/lib/supabase/server-client.ts) so RLS
 * stays the real enforcement boundary — see supabase/migrations/0001_init.sql.
 */
export function createSupabaseServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — see docs/commerce-architecture.md");
  return createClient(getSupabaseUrl(), key, { auth: { persistSession: false } });
}

import { createClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/** Stateless anon-key client for public, unauthenticated storefront reads (products only — RLS
 * restricts this key to published rows, see supabase/migrations/0001_init.sql). No session/
 * cookies needed since nothing here is per-user. */
export function createSupabasePublicClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), { auth: { persistSession: false } });
}

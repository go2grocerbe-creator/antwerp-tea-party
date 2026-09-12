import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Server-side Supabase client bound to the request's cookies, so it carries the signed-in
 * admin's session and every query runs under their RLS permissions (see
 * supabase/migrations/0001_init.sql — there is deliberately no server-side bypass of RLS for
 * routine reads/writes). Create a fresh instance per request; never module-cache this.
 *
 * Throws if Supabase isn't configured — callers must check isSupabaseConfigured() first (see
 * src/lib/supabase/env.ts) and render a "not configured" state instead of calling this.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where cookies() is read-only. Session
          // writes happen from the sign-in/sign-out Server Actions instead, which run in a
          // context where setting cookies is allowed.
        }
      },
    },
  });
}

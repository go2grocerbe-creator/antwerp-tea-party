import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server-client";
import { isSupabaseConfigured } from "./env";

export type AdminSession = {
  userId: string;
  email: string | null;
};

/** Returns the current admin session, or null if signed out / not an admin_users row. */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // RLS on admin_users only lets a signed-in user see their own row unless they're already an
  // admin (see supabase/migrations/0001_init.sql) - an empty result means "not an admin", not
  // an error, so this doubles as the authorization check.
  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) return null;
  return { userId: user.id, email: user.email ?? null };
}

/** Redirects to /admin/login when there is no valid admin session. Call at the top of every
 * protected admin page/layout. */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

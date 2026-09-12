import { signInAction } from "@/lib/admin/auth-actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const ERROR_MESSAGES: Record<string, string> = {
  not_configured: "Supabase is not configured for this deployment yet. See docs/commerce-architecture.md.",
  missing_credentials: "Enter both an email and a password.",
  invalid_credentials: "Incorrect email or password.",
};

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="admin-login">
      <h1>Antwerp Tea Party — Admin</h1>

      {!configured && (
        <p className="admin-notice">
          Supabase is not configured yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and run the migration in{" "}
          <code>supabase/migrations/0001_init.sql</code> before anyone can sign in — see{" "}
          <code>docs/commerce-architecture.md</code>.
        </p>
      )}

      {error && configured && <p className="admin-notice admin-notice--error">{ERROR_MESSAGES[error] ?? "Sign-in failed."}</p>}

      <form action={signInAction} className="admin-login__form">
        <label>
          Email
          <input type="email" name="email" required autoComplete="username" disabled={!configured} />
        </label>
        <label>
          Password
          <input type="password" name="password" required autoComplete="current-password" disabled={!configured} />
        </label>
        <button type="submit" className="button" disabled={!configured}>
          Sign in
        </button>
      </form>
    </main>
  );
}

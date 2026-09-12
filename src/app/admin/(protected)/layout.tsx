import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdminSession } from "@/lib/supabase/admin-auth";
import { signOutAction } from "@/lib/admin/auth-actions";

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <Link href="/admin" className="admin-shell__brand">
          Antwerp Tea Party — Admin
        </Link>
        <div className="admin-shell__account">
          <span>{session.email}</span>
          <form action={signOutAction}>
            <button type="submit" className="text-link">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="admin-shell__content">{children}</main>
    </div>
  );
}

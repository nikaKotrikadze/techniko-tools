import Link from "next/link";
import { signOut } from "../actions";
import { requireAdmin } from "@/lib/admin";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase, email } = await requireAdmin();
  const { count: newSubmissions } = await supabase
    .from("tool_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex gap-1 text-sm" aria-label="Admin">
          <Link href="/admin" className="rounded-lg px-3 py-1.5 hover:bg-card">Tools</Link>
          <Link href="/admin/submissions" className="rounded-lg px-3 py-1.5 hover:bg-card">
            Submissions
            {!!newSubmissions && (
              <span className="ml-1.5 rounded-full bg-accent px-1.5 text-xs text-white dark:text-black">{newSubmissions}</span>
            )}
          </Link>
          <Link href="/admin/waitlist" className="rounded-lg px-3 py-1.5 hover:bg-card">Waitlist</Link>
        </nav>
        <form action={signOut} className="flex items-center gap-3 text-sm text-muted">
          <span className="hidden sm:inline">{email}</span>
          <button className="rounded-lg border border-border px-3 py-1.5 hover:border-accent">Sign out</button>
        </form>
      </div>
      {children}
    </div>
  );
}

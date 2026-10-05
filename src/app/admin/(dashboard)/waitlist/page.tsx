import { requireAdmin } from "@/lib/admin";

export default async function WaitlistPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("waitlist_emails").select("email, created_at").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Waitlist ({data.length})</h1>
      {data.length > 0 && (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          All emails, ready to paste into your email tool
          <textarea readOnly rows={3} value={data.map((r) => r.email).join(", ")} className="admin-input font-mono text-xs" />
        </label>
      )}
      <ul className="divide-y divide-border rounded-2xl border border-border text-sm">
        {data.map((r) => (
          <li key={r.email} className="flex justify-between gap-3 p-3">
            <span className="truncate">{r.email}</span>
            <span className="shrink-0 text-muted">{new Date(r.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

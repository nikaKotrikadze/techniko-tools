import Link from "next/link";
import { setSubmissionStatus } from "../../actions";
import { requireAdmin } from "@/lib/admin";

type Submission = {
  id: number;
  tool_name: string;
  website_url: string;
  contact_email: string;
  message: string | null;
  status: string;
  created_at: string;
};

export default async function SubmissionsPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from("tool_submissions").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const submissions = data as Submission[];

  return (
    <main className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Submissions ({submissions.length})</h1>
      {submissions.length === 0 && <p className="text-muted">No submissions yet.</p>}
      <ul className="flex flex-col gap-3">
        {submissions.map((s) => (
          <li key={s.id} className="flex flex-col gap-2 rounded-2xl border border-border p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <a href={s.website_url} target="_blank" rel="noopener" className="font-semibold hover:text-accent">
                {s.tool_name} ↗
              </a>
              <span className="text-xs text-muted">{new Date(s.created_at).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
            </div>
            <a href={`mailto:${s.contact_email}`} className="text-sm text-muted hover:underline">{s.contact_email}</a>
            {s.message && <p className="text-sm whitespace-pre-line">{s.message}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <form action={setSubmissionStatus.bind(null, s.id)} className="flex items-center gap-2">
                <select name="status" defaultValue={s.status} aria-label="Status" className="admin-input py-1.5 text-sm">
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="added">Added</option>
                </select>
                <button className="rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent">Save</button>
              </form>
              <Link
                href={`/admin/tools/new?${new URLSearchParams({ name: s.tool_name, url: s.website_url })}`}
                className="text-sm text-accent hover:underline"
              >
                Create tool from this →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

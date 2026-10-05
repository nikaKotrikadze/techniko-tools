import { redirect } from "next/navigation";
import { createAdminSessionClient } from "@/lib/supabase/server";

// Call first in every admin page and action. RLS enforces the same rule again inside the database.
export async function requireAdmin() {
  const supabase = await createAdminSessionClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=not-admin");
  return { supabase, email: data.claims.email as string | undefined };
}

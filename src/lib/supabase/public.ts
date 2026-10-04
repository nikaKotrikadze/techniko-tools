import { createClient } from "@supabase/supabase-js";

// Cookieless client for public reads. No cookies = pages can be statically generated.
// RLS limits it to published tools, categories, tags, and public inserts.
export function createPublicClient() {
  return createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    auth: { persistSession: false },
  });
}

export function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}. Copy .env.example to .env.local and fill it in.`);
  return value;
}

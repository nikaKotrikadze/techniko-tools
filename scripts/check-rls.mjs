// Verifies the public (anon) key sees only what it should.
// Run: node --env-file=.env.local scripts/check-rls.mjs
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const cats = await db.from("categories").select("slug");
assert.ifError(cats.error);
assert.equal(cats.data.length, 5, "expected 5 categories");

const tools = await db.from("tools").select("slug, published");
assert.ifError(tools.error);
assert.ok(tools.data.length > 0, "public should see published tools");
assert.ok(tools.data.every((t) => t.published), "public must not see drafts");

const tags = await db.from("tool_tags").select("tool_id");
assert.ifError(tags.error);

const write = await db.from("categories").insert({ name: "Hack", slug: "hack" });
assert.ok(write.error, "public must not write categories");

const upd = await db.from("tools").update({ rating: 1 }).eq("slug", "claude").select();
assert.equal(upd.data?.length ?? 0, 0, "public must not update tools");

const emails = await db.from("waitlist_emails").select("email");
assert.equal(emails.data?.length ?? 0, 0, "public must not read emails");

const sub = await db.from("tool_submissions").insert({
  tool_name: "RLS check", website_url: "https://example.com", contact_email: "check@example.com", status: "added",
});
assert.ok(sub.error, "public must not set submission status");

console.log(`RLS OK: ${tools.data.length} published tools visible, drafts and writes blocked.`);

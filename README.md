# TechNiko Tools

Directory of AI tools reviewed on Instagram by [@thetechniko](https://instagram.com/thetechniko). Visitors browse, search, and filter tools; each tool has a page with my rating, verdict, pricing, and the embedded reel. Featured (paid) spots are always labeled **Sponsored**.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · Netlify. Everything runs on free tiers.

## How it works

- Public pages (home, `/tools/[slug]`, `/category/[slug]`, `/submit`, `/advertise`) are **pre-rendered static HTML**. They refresh hourly, and instantly whenever you save something in the admin.
- Public data is read with the Supabase anon key; **Row Level Security** limits it to published tools, categories, and tags, plus inserting waitlist emails and submissions.
- `/admin` uses Supabase Auth. Only the user listed in the `admins` table can change anything; the database enforces this too.

```
src/
  app/            pages, server actions, sitemap, robots, OG images
  app/admin/      admin dashboard (login, tools, submissions, waitlist)
  components/     UI components
  lib/            data queries, Supabase clients, admin guard
  proxy.ts        refreshes the admin session, redirects logged-out users
supabase/
  migrations/     schema + RLS (run once)
  seed.sql        example categories and tools
```

## 1. Create the Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query**: paste all of `supabase/migrations/20261004000000_init.sql` and run it. **Run it only once.**
3. **New query** again: paste `supabase/seed.sql` and run it (optional example data).
4. **Project Settings → API**: copy the Project URL and the anon / publishable key.

## 2. Run locally

```bash
npm install
cp .env.example .env.local   # paste your Supabase URL + key
npm run dev                  # http://localhost:3000
npm run check:rls            # verifies the public key can't see drafts or write data
```

Testing on your phone: open the "Network" URL that `npm run dev` prints (same Wi-Fi).

## 3. Admin account

1. Supabase → **Authentication → Users → Add user**: your email + password, tick "Auto Confirm User".
2. Supabase → **Authentication → Sign In / Providers**: turn off "Allow new users to sign up".
3. Supabase → **SQL Editor**, make that account the admin:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
4. Sign in at `/admin`.

## 4. Deploy to Netlify

1. Push this repo to GitHub.
2. [app.netlify.com](https://app.netlify.com) → **Add new project → Import an existing project → GitHub** → pick the repo. Build settings come from `netlify.toml`.
3. **Environment variables** (before the first deploy):
   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon / publishable key |
   | `NEXT_PUBLIC_SITE_URL` | your live URL, e.g. `https://techniko-tools.netlify.app` (no trailing slash) |
4. Deploy. Every push to `main` redeploys automatically.
5. Custom domain: **Domain management → Add a domain**, then update `NEXT_PUBLIC_SITE_URL` and redeploy.
6. Submit `https://your-domain/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

## Day-to-day

- **Add a tool:** `/admin` → New tool. Paste the reel URL; logos are PNG/JPG/WebP under 800 KB.
- **Sell a featured spot:** tick Featured and set "Featured until". It stops showing as Featured after that date, no action needed.
- **Submissions:** `/admin/submissions` → "Create tool from this" prefills the form.
- **Media kit numbers:** edit `STATS` in `src/app/advertise/page.tsx`.
- **Analytics:** see `src/components/Analytics.tsx` for where to plug in a cookie-free provider.

## Good to know

- Free Supabase projects **pause after 7 days without traffic**. Any visit to the live site counts; if it pauses, hit "Restore" in the dashboard.
- Never commit `.env.local`. Only the anon key is used; RLS is what keeps data safe, so don't loosen the policies.

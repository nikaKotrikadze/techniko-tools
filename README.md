# TechNiko Tools

Directory of AI tools reviewed on Instagram by [@thetechniko](https://instagram.com/thetechniko).

Stack: Next.js (App Router, TypeScript), Tailwind CSS, Supabase, Netlify.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and anon key
npm run dev                  # http://localhost:3000
```

Full setup (migrations, seed, deploy) gets added in Phase 7.

## Admin account

1. Supabase → **Authentication → Users → Add user**: your email + password, tick "Auto Confirm User".
2. Supabase → **Authentication → Sign In / Providers**: turn off "Allow new users to sign up".
3. Supabase → **SQL Editor**, make that account the admin:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
4. Sign in at `/admin`.

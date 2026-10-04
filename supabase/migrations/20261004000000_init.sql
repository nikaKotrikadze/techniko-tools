-- TechNiko Tools: schema, row level security, logo storage.

create type public.pricing_type as enum ('free', 'freemium', 'paid');
create type public.submission_status as enum ('new', 'reviewed', 'added');

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text
);

create table public.tools (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tagline text,
  description text,
  website_url text not null check (website_url ~ '^https?://'),
  affiliate_url text check (affiliate_url ~ '^https?://'),
  logo_url text,
  pricing_type public.pricing_type not null default 'freemium',
  price_note text,
  rating numeric(2, 1) check (rating between 1 and 5), -- allows half stars like 4.5
  verdict text,
  reel_url text check (reel_url ~ '^https://(www\.)?instagram\.com/'),
  category_id bigint references public.categories on delete set null,
  is_featured boolean not null default false,
  featured_until date, -- null = featured until turned off
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.tools (category_id);

create table public.tags (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table public.tool_tags (
  tool_id bigint not null references public.tools on delete cascade,
  tag_id bigint not null references public.tags on delete cascade,
  primary key (tool_id, tag_id)
);
create index on public.tool_tags (tag_id);

create table public.waitlist_emails (
  id bigint generated always as identity primary key,
  email text not null unique
    check (email = lower(email) and char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

create table public.tool_submissions (
  id bigint generated always as identity primary key,
  tool_name text not null check (char_length(tool_name) between 1 and 100),
  website_url text not null check (website_url ~ '^https?://' and char_length(website_url) <= 500),
  contact_email text not null check (char_length(contact_email) <= 254 and contact_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message text check (char_length(message) <= 2000),
  status public.submission_status not null default 'new',
  created_at timestamptz not null default now()
);

-- Admin: the single account whose user id is listed here. Being logged in is not enough,
-- so a stray signup can never write data.
create table public.admins (
  user_id uuid primary key references auth.users on delete cascade
);

create function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Row level security
alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.tags enable row level security;
alter table public.tool_tags enable row level security;
alter table public.waitlist_emails enable row level security;
alter table public.tool_submissions enable row level security;
alter table public.admins enable row level security; -- no policies: only is_admin() reads it

create policy "public read" on public.categories for select using (true);
create policy "public read" on public.tags for select using (true);
create policy "public read published" on public.tools for select using (published or public.is_admin());
create policy "public read published" on public.tool_tags for select
  using (exists (select 1 from public.tools t where t.id = tool_id and t.published) or public.is_admin());
create policy "public insert" on public.waitlist_emails for insert with check (true);
create policy "public insert" on public.tool_submissions for insert with check (status = 'new');

create policy "admin all" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.tools for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.tags for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.tool_tags for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.waitlist_emails for all using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.tool_submissions for all using (public.is_admin()) with check (public.is_admin());

-- Explicit grants (newer Supabase projects don't auto-expose tables). RLS above still decides rows.
grant select on public.categories, public.tags, public.tools, public.tool_tags to anon, authenticated;
grant insert on public.waitlist_emails, public.tool_submissions to anon, authenticated;
grant select, insert, update, delete on public.categories, public.tags, public.tools, public.tool_tags,
  public.waitlist_emails, public.tool_submissions to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- Logo storage: public bucket for reading, only the admin can upload/change/delete.
insert into storage.buckets (id, name, public) values ('logos', 'logos', true) on conflict (id) do nothing;
create policy "admin upload logos" on storage.objects for insert to authenticated
  with check (bucket_id = 'logos' and public.is_admin());
create policy "admin update logos" on storage.objects for update to authenticated
  using (bucket_id = 'logos' and public.is_admin());
create policy "admin delete logos" on storage.objects for delete to authenticated
  using (bucket_id = 'logos' and public.is_admin());

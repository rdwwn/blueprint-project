-- The Blueprint Project: saves, reviews, and reports.
-- Run this in Supabase: Dashboard > SQL Editor > New query > paste > Run.
-- The app talks to the database only through server code using the secret key,
-- so these tables are locked down with RLS and NO policies: even the public
-- (publishable/anon) key can read zero rows if it ever leaks.

-- 1. SAVES: a slug saved by an anonymous visitor.
create table if not exists public.saves (
  id uuid primary key default gen_random_uuid(),
  anon_id text not null,
  opportunity_slug text not null,
  created_at timestamptz not null default now(),
  unique (anon_id, opportunity_slug)
);

create index if not exists saves_anon_idx on public.saves (anon_id);
create index if not exists saves_slug_idx on public.saves (opportunity_slug);

-- 2. REVIEWS: student reviews of a specific program.
-- status: pending (awaiting founder approval) -> approved | rejected
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  anon_id text not null,
  opportunity_slug text not null,
  opportunity_name text not null,
  author text not null,
  grade text,
  rating int not null check (rating between 1 and 5),
  text text not null check (char_length(text) between 20 and 800),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz,
  moderated_note text
);

create index if not exists reviews_slug_status_idx on public.reviews (opportunity_slug, status);
create index if not exists reviews_status_idx on public.reviews (status, created_at desc);
create index if not exists reviews_anon_idx on public.reviews (anon_id);

-- 3. REPORTS: "flag incorrect info" submissions from the contribute page.
-- status: open -> resolved
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  anon_id text,
  opportunity_slug text,
  opportunity_name text,
  issue_type text not null,
  details text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  moderator_note text
);

create index if not exists reports_status_idx on public.reports (status, created_at desc);

-- Lock everything down. No policies = deny by default for anon/authenticated.
-- The server's secret key bypasses RLS, which is the only path the app uses.
alter table public.saves enable row level security;
alter table public.reviews enable row level security;
alter table public.reports enable row level security;

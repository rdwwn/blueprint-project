-- The Blueprint Project: people who want to help build it.
-- Run after 0001/0002 in Supabase: Dashboard > SQL Editor > New query > Run.
-- status: new (waiting on a founder) -> handled
create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  anon_id text,
  name text not null,
  email text not null,
  grade text,
  help_with text not null,
  message text not null check (char_length(message) between 20 and 1500),
  link text,
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

create index if not exists contributions_status_idx on public.contributions (status, created_at desc);

-- Same lock-down as the other tables: server-only access via the secret key.
alter table public.contributions enable row level security;
grant select, insert, update, delete on public.contributions to service_role;

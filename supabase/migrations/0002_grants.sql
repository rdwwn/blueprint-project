-- Grant the app's server role access to the three tables. The browser never
-- talks to the database directly, so the public/anon role still gets nothing
-- (RLS is enabled with no policies on all three tables).
grant select, insert, update, delete on public.saves, public.reviews, public.reports to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;

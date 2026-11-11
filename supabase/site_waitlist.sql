-- Website waitlist (brief §7.9). Not run yet: ask before running it against
-- the Narsil project. The browser never talks to Supabase directly; the site's
-- /api/waitlist route inserts with the publishable (anon) key.

create table public.site_waitlist (
  id bigint generated always as identity primary key,
  email text not null unique
    check (length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source text check (length(source) <= 80),
  campaign text check (length(campaign) <= 80),
  created_at timestamptz not null default now()
);

alter table public.site_waitlist enable row level security;

create policy "anyone can join the waitlist"
  on public.site_waitlist for insert to anon, authenticated with check (true);

-- No select, update or delete policies: only the service role can read the list.

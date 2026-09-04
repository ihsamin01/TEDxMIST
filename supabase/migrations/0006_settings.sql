-- Registration can now be opened and closed from the admin page.
--
-- Required. Without this the toggle has nowhere to write, and the site falls
-- back to whatever `registration.isOpen` says in config/event.ts.
--
-- One row, enforced by the primary key: the id can only ever be true, so a
-- second row cannot exist and nothing has to guess which row to read.

create table if not exists public.settings (
  id                boolean primary key default true,
  registration_open boolean not null default true,
  updated_at        timestamptz not null default now(),
  constraint settings_single_row check (id)
);

comment on table public.settings is
  'Site-wide switches the organizers control from /admin. Exactly one row.';

-- Seed the row. Registration starts open.
insert into public.settings (id, registration_open)
values (true, true)
on conflict (id) do nothing;

-- Same posture as the registrations table: no anonymous access at all. The
-- app reads and writes this with the secret key, server side only.
alter table public.settings enable row level security;

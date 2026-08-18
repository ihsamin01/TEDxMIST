-- TEDxMIST attendee registrations.
-- One row per person who fills in the form at /register.
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Who they are
  full_name   text not null,
  email       text not null,
  phone       text not null,
  university  text not null,
  department  text not null,
  study_year  text not null,
  student_id  text not null,

  -- Payment. transaction_id is unique so the same receipt cannot be
  -- submitted twice, which is the usual way people try to get a free seat.
  payment_method text not null,
  transaction_id text not null,
  amount         numeric(10, 2),

  -- Emergency contact and socials
  emergency_contact text not null,
  linkedin          text,
  facebook          text,

  -- Set from the admin table once the payment has been checked.
  status text not null default 'pending'
         check (status in ('pending', 'confirmed', 'rejected'))
);

-- Same receipt cannot be reused. Case-insensitive because people type
-- transaction ids in whatever case their SMS showed them.
create unique index if not exists registrations_transaction_id_key
  on public.registrations (lower(transaction_id));

-- One seat per email address.
create unique index if not exists registrations_email_key
  on public.registrations (lower(email));

-- The admin table is sorted newest first.
create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

-- Row level security with no policies at all: anon and authenticated clients
-- get nothing. Every read and write in this app goes through the server using
-- the project's secret key, which bypasses RLS. That key never reaches the
-- browser.
alter table public.registrations enable row level security;

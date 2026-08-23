-- One row per person who signs up at /register.
-- Run once in the Supabase SQL editor.

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

  -- transaction_id is unique, so one receipt can't buy two seats.
  payment_method text not null,
  transaction_id text not null,
  amount         numeric(10, 2),

  -- Emergency contact and socials
  emergency_contact text not null,
  linkedin          text,
  facebook          text,

  -- Set from /admin once the payment is checked.
  status text not null default 'pending'
         check (status in ('pending', 'confirmed', 'rejected'))
);

-- Case-insensitive, people copy transaction ids in whatever case.
create unique index if not exists registrations_transaction_id_key
  on public.registrations (lower(transaction_id));

-- One seat per email address.
create unique index if not exists registrations_email_key
  on public.registrations (lower(email));

-- /admin sorts newest first.
create index if not exists registrations_created_at_idx
  on public.registrations (created_at desc);

-- RLS on with no policies, so anon and authenticated clients get nothing.
-- All access goes through the server with the secret key, which bypasses RLS.
alter table public.registrations enable row level security;

-- Ticket numbers and confirmation-email tracking.
-- Run this in the Supabase SQL editor after 0001.

-- A short sequential number per attendee, printed on the confirmation email
-- and checked at the gate. Existing rows are numbered in insertion order.
alter table public.registrations
  add column if not exists ticket_no int generated always as identity;

-- When the confirmation email actually went out. Null means it has not been
-- sent, so re-confirming somebody already confirmed does not email them twice.
alter table public.registrations
  add column if not exists confirmation_sent_at timestamptz;

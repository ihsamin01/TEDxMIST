-- Ticket numbers and email tracking. Run after 0001.

-- Sequential number per attendee, printed on the email and checked at the
-- gate. Existing rows get numbered in insertion order.
alter table public.registrations
  add column if not exists ticket_no int generated always as identity;

-- When the email went out. Null means not sent, which stops a second
-- confirm from emailing the same person twice.
alter table public.registrations
  add column if not exists confirmation_sent_at timestamptz;

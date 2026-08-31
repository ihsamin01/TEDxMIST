-- The form now asks for a photo of the student ID card instead of a typed
-- ID number.
--
-- Required. Three things happen here, and registrations fail until all three
-- have run.

-- 1. Where the uploaded images live.
--    Private on purpose. These are photographs of student ID cards, so the
--    bucket must never be public; the admin page reads them through short
--    lived signed URLs instead.
insert into storage.buckets (id, name, public)
values ('id-cards', 'id-cards', false)
on conflict (id) do nothing;

-- 2. The path of the uploaded image, relative to that bucket.
alter table public.registrations add column if not exists id_card_path text;

comment on column public.registrations.id_card_path is
  'Object path inside the private id-cards bucket. Null for rows registered before uploads existed.';

-- 3. The old typed ID number is no longer collected, so it can no longer be
--    required. Existing rows keep whatever they already have.
alter table public.registrations alter column student_id drop not null;

# TEDxMIST

Website for TEDxMIST 2026, an independently organized TEDx event at the
Military Institute of Science and Technology, Dhaka.

**Theme:** Echoes of Tomorrow
**Date:** 19 November 2026

Built with Next.js and Tailwind.
Open https://tedxmist.vercel.app/




## Before the next deploy

Run these in the Supabase SQL editor, in order. Registrations fail to save
until both have run.

- `supabase/migrations/0004_tshirt_size.sql` — the payment step asks for a
  T-shirt size.
- `supabase/migrations/0005_id_card_upload.sql` — the form now takes a photo
  of the student ID card instead of a typed number. This creates the private
  `id-cards` storage bucket, adds the column holding each file's path, and
  makes the old `student_id` column optional.

ID cards are personal, so the bucket is private and has no public URLs. The
admin table links each one through `/admin/id-card`, which checks the session
and issues a signed link that expires after a minute.

## Fees

MIST students pay one rate and everyone else pays another. Both figures, the
bKash number, the T-shirt sizes and the guidelines shown on the payment step
live in the `registration` block of `src/config/event.ts`.

Which rate applies is decided on the server from the university chosen, so the
amount stored on the row cannot be changed from the browser.

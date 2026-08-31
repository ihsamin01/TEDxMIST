# TEDxMIST

Website for TEDxMIST 2026, an independently organized TEDx event at the
Military Institute of Science and Technology, Dhaka.

**Theme:** Echoes of Tomorrow
**Date:** 19 November 2026

Built with Next.js and Tailwind.
Open https://tedxmist.vercel.app/




## Before the next deploy

Run `supabase/migrations/0004_tshirt_size.sql` in the Supabase SQL editor.
The payment step asks for a T-shirt size, and until that column exists every
registration fails to save.

## Fees

MIST students pay one rate and everyone else pays another. Both figures, the
bKash number, the T-shirt sizes and the guidelines shown on the payment step
live in the `registration` block of `src/config/event.ts`.

Which rate applies is decided on the server from the university chosen, so the
amount stored on the row cannot be changed from the browser.

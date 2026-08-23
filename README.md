# TEDxMIST

Website for TEDxMIST 2026, an independently organized TEDx event at the
Military Institute of Science and Technology, Dhaka.

**Theme:** Echoes of Tomorrow
**Date:** 19 November 2026

Built with Next.js and Tailwind.

## Running locally

```bash
npm install
npm run dev
```

Open https://tedxmist.vercel.app/

## Editing the content

Everything on the site comes from `src/config/event.ts`. Names, dates, the
speaker list, the schedule, team members, social links, all of it. You
shouldn't need to open any other file to update the site.

A few things worth knowing:

- The countdown reads the `startsAt` date. `+06:00` at the end is our timezone.
- Speaker photos are optional. Drop images in `public/speakers/` and add the
  path to the speaker, or leave it out and the card shows their initials
  instead.
- `registration.isOpen: false` closes sign-ups and greys out the button.
- The fee, the bKash number and the payment methods on the form are all in the
  `registration` block.

## Registrations

People sign up at `/register` and everything lands in a Supabase table.
`/admin` is where we look at it.

Setup, once:

1. Create a Supabase project.
2. Run the files in `supabase/migrations/` in the SQL editor, in order.
3. Copy `.env.local.example` to `.env.local` and fill it in. The URL and secret
   key are under Project Settings → API Keys. `ADMIN_PASSWORD` is whatever you
   want the team to type at `/admin`.
4. Add the same variables in Vercel under Settings → Environment Variables,
   then redeploy.

If those variables are missing the page just says registration is opening soon,
so it's safe to deploy before Supabase is ready.

Using it:

- `/admin` lists everyone, newest first. Each row has a Pending / Confirmed /
  Rejected dropdown. That's how you mark a payment as checked.
- Download CSV gives you the whole table as a spreadsheet.
- There's no limit on sign-ups right now. If we settle on a number, put it in
  `registration.capacity` and the form stops there by itself.
- One email and one transaction ID per person. Duplicates are rejected.

Keep the secret key server-side. Don't rename it to `NEXT_PUBLIC_` anything,
that would hand the whole database to the browser.

## Confirmation emails

Setting someone to Confirmed emails them their ticket number, the venue and
what to bring. It only sends once, `confirmation_sent_at` on the row keeps
track. If a send fails there's a resend link under the dropdown.

Mail goes through Gmail SMTP from the event's own account. Setup:

1. Turn on 2-Step Verification on that Gmail account. You can't create an app
   password without it.
2. Google Account → Security → App passwords. Create one and copy it.
3. `GMAIL_USER` is the address, `GMAIL_APP_PASSWORD` is the 16-letter app
   password. Not the account password, that won't work.

Gmail allows roughly 500 a day, which is plenty for us. Without those two
variables confirming still works, people just don't get emailed, and there's a
warning at the top of the admin table.

The template is in `src/lib/email.ts`. It reads the date and venue from
`event.ts`.

One known problem: mail sent from a gmail.com address sometimes lands in spam.
Buying a domain and sending from that is the real fix.

## Deploying

Push to `main` and Vercel redeploys.

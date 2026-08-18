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
- Set `registration.isOpen` to `false` to grey out the register button and
  close the form.
- The fee, the bKash/Nagad number and the payment methods on the form all come
  from the `registration` block.

## Registrations

Sign-ups happen on `/register` and land in a Supabase table. `/admin` shows
them as a table you can search, filter and export.

Set it up once:

1. Make a project at supabase.com.
2. Open the SQL editor and run the files in `supabase/migrations/` in order,
   `0001` first.
3. Copy `.env.local.example` to `.env.local` and fill it in. The Supabase URL
   and secret key are under Project Settings → API Keys. `ADMIN_PASSWORD` is
   whatever you want the team to type at `/admin`.
4. Add the same variables in Vercel, under Settings → Environment Variables,
   then redeploy.

Until those variables exist the form politely says "opening soon" instead of
crashing, so the site is safe to deploy before Supabase is ready.

Day to day:

- `/admin` lists everyone, newest first, with a Pending / Confirmed / Rejected
  dropdown on each row. Use it to mark a transaction ID as verified.
- "Download CSV" gives you the whole table as a spreadsheet.
- Sign-ups are not capped. Put the agreed number in `registration.capacity`
  and the form closes itself at that figure, shows a seats-left line and adds
  a "seats left" count to the table. Rejected rows give their seat back.
- The same email or the same transaction ID cannot be used twice.

The secret key bypasses the database's row level security, so it must stay
server-side. Never rename it to `NEXT_PUBLIC_` anything.

## Confirmation emails

Moving somebody to **Confirmed** in `/admin` emails them their ticket number,
the event details, what they filled in, and what to bring. It sends once —
`confirmation_sent_at` on the row stops a second confirm from emailing them
again. There is a "resend" link under the dropdown if a send fails.

Mail goes out through Gmail's SMTP server, from the event's own Gmail account.
To set it up:

1. Sign in to that Gmail account and turn on 2-Step Verification. App
   passwords do not exist without it.
2. Google Account → Security → App passwords. Make one and copy it.
3. Put the address in `GMAIL_USER` and the app password in
   `GMAIL_APP_PASSWORD`. It is not the account's normal password, and the
   normal password will not work.

Free Gmail sends about 500 messages a day, comfortably more than a room this
size needs. Without those two variables the admin table shows a banner saying
no emails are going out; confirming still works, nobody is just told about it.

The template lives in `src/lib/email.ts`. It reads the date, venue and map
link from `src/config/event.ts`, so correcting the schedule corrects the
email too.

## Deploying

The site is on Vercel and redeploys itself whenever anything is pushed to
`main`. Nothing to run by hand.


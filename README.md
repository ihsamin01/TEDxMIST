# TEDxMIST

Website for TEDxMIST 2026, an independently organized TEDx event at the
Military Institute of Science and Technology, Dhaka.

**Theme:** Echoes of Tomorrow
**Date:** 19 November 2026
**Seats:** 100 (capped by our TEDx University licence)

Built with Next.js and Tailwind.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Editing the content

Everything on the site comes from `src/config/event.ts`. Names, dates, the
speaker list, the schedule, team members, social links, all of it. You
shouldn't need to open any other file to update the site.

A few things worth knowing:

- The countdown reads the `startsAt` date. `+06:00` at the end is our timezone.
- Speaker photos are optional. Drop images in `public/speakers/` and add the
  path to the speaker, or leave it out and the card shows their initials
  instead.
- The registration button stays greyed out until you put a form link in
  `registration.formUrl`, so it's safe to have the site live before the form
  exists.

## Deploying

The site is on Vercel and redeploys itself whenever anything is pushed to
`main`. Nothing to run by hand.

If you ever need to set it up again: import the repo at vercel.com/new and
press Deploy. Vercel picks up the Next.js config on its own.

## A note on the TEDx branding

TED has rules about this and we have to follow them to keep the licence:

- "TEDx" is always red, "MIST" never is, and there's no space between them
- The footer line "This independent TEDx event is operated under license from
  TED" has to stay
- Red, black and white only. The palette isn't unfinished, it's deliberate.

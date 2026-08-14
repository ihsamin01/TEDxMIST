# TEDxMIST — Event Website

The official site for **TEDxMIST 2026**, an independently organized TEDx event
at the Military Institute of Science and Technology, Mirpur Cantonment, Dhaka.

- **Theme:** Echoes of Tomorrow
- **Date:** 19 November 2026
- **Capacity:** 100 in-person seats (TEDx University licence cap)

Built with Next.js 16, React 19 and Tailwind CSS v4. The whole page is
statically prerendered, so it can be hosted free.

---

## Running it on your machine

```bash
npm install     # only needed the first time
npm run dev
```

Then open <http://localhost:3000>. The page reloads by itself whenever you save
a file.

Other commands:

| Command         | What it does                                       |
| --------------- | -------------------------------------------------- |
| `npm run dev`   | Development server with hot reload                  |
| `npm run build` | Production build — run this before deploying        |
| `npm run start` | Serves the production build locally                 |
| `npm run lint`  | Checks the code for problems                        |

---

## Editing the site

**Almost everything lives in one file: [`src/config/event.ts`](src/config/event.ts).**
You should not need to open any component to change the site's content.

That file is split into eight labelled blocks:

| Block                | Controls                                                       |
| -------------------- | -------------------------------------------------------------- |
| `event`              | Name, theme, tagline, date, time, venue, seat count, contact    |
| `registration`       | The link your "Reserve your seat" button points at              |
| `about`              | The two About paragraphs and the theme explanation              |
| `speakers`           | Every speaker card                                              |
| `schedule`           | The running order for the day                                   |
| `team`               | The organizing team grid                                        |
| `socials`            | Facebook / Instagram / LinkedIn / YouTube / TED links           |
| `navLinks`           | The menu items in the top bar                                   |

### Setting the countdown

The countdown reads a single field:

```ts
startsAt: "2026-11-19T10:00:00+06:00",
```

`+06:00` is Bangladesh Standard Time. Change the date or hour and the countdown,
the hero and the schedule heading all follow.

### Turning registration on

Registration goes through an external form (Google Forms, Microsoft Forms, Luma
— whatever you prefer). Paste its link here:

```ts
export const registration = {
  formUrl: "https://forms.gle/your-form-link",
  isOpen: true,
  ...
};
```

The button has three automatic states, so **the site is safe to publish before
the form exists**:

- `formUrl` empty → button is greyed out and reads _"Registration opening soon"_
- `isOpen: false` → button reads _"Registration closed"_
- both set → live link that opens in a new tab

### Adding a speaker

Append an entry to the `speakers` array:

```ts
{
  name: "Ayesha Rahman",
  title: "Research Lead, Example Institute",
  topic: "What we owe the people who come after us",
  bio: "Two or three sentences about who they are.",
  photo: "/speakers/ayesha.jpg",   // optional
},
```

The grid reflows on its own, so you can add or remove speakers freely.

**Photos are optional.** Leave `photo` out and the card shows the speaker's
initials on a red gradient — it looks deliberate, so a half-confirmed line-up
still looks finished. To add a real photo, drop the image in
`public/speakers/` and reference it as `/speakers/filename.jpg`. Square or 4:3
images around 800px wide work best.

Team photos work exactly the same way via `public/team/`.

### Adding a schedule slot

```ts
{
  time: "14:30",
  title: "Session Two — Signals",
  detail: "Optional line of description.",
  highlight: true,   // draws the marker in TED red — use it for talk sessions
},
```

---

## What moves on the page

The site is deliberately restrained on colour — TED's brand rules allow red,
black, white and grey, and nothing else — so the personality comes from motion
and interaction instead:

| Where          | What happens                                                              |
| -------------- | ------------------------------------------------------------------------- |
| Top of window  | A red progress bar tracks how far down the page you are                    |
| Nav            | The current section's link turns red with an underline as you scroll past it |
| Hero           | Echo rings drift towards your cursor; the centre dot breathes; the headline rises in on load |
| Hero           | The campus name is drawn as outlined type against the solid red "TEDx"     |
| Between sections | A ticker of theme words scrolls past — hover to pause and read one       |
| Speakers       | Cards lift on hover and **open a full bio modal when clicked**             |
| Stats          | The four numbers count up from zero the first time they scroll into view   |
| Schedule       | Slots alternate either side of a central spine on desktop                  |
| Whole page     | Sections fade and lift into view as you reach them                         |
| Bottom right   | A back-to-top button appears once you are past the hero                    |

### Accessibility

None of the above is decoration at the expense of usability:

- **Reduced motion is fully honoured.** Anyone whose OS is set to "reduce
  motion" gets the complete page with every animation switched off, not a
  broken one.
- **The speaker modal is properly trapped**: Escape closes it, focus moves to
  the close button on open and returns to the card on close, Tab cycles inside
  it, and the page behind cannot scroll.
- Every interactive element is reachable by keyboard with a visible red focus
  ring, and the countdown is announced to screen readers as a timer.

### Responsiveness

Everything is centre-aligned and fluid from **320px phones up to wide
desktops**:

- Headlines and the countdown use `clamp()`, so they scale smoothly instead of
  jumping at breakpoints.
- The countdown is a four-across grid that stays readable on the narrowest
  phones.
- The schedule is a single left-spine column on phones and switches to the
  alternating two-sided timeline from 768px up.
- Speakers go 1 → 2 → 3 columns; the team grid goes 2 → 3 → 4.
- The pointer-parallax effect is skipped entirely on touch devices, where there
  is no cursor to follow.
- `overflow-x` is locked at the body, so nothing can ever cause sideways
  scrolling.

---

## Deploying free on Vercel

The site is fully static, so Vercel's free Hobby tier is enough.

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. **Add New → Project**, pick the repository, and press **Deploy**. Vercel
   detects Next.js on its own — no settings to change.
4. You get a live URL like `tedxmist.vercel.app` in about a minute. Every
   `git push` after that redeploys automatically.

### Connecting the tedxmist.com domain

Once you own the domain:

1. In Vercel: **Project → Settings → Domains → Add**, enter `tedxmist.com`.
2. Vercel shows you the DNS records to create.
3. Add those records at your registrar (or in Cloudflare if your nameservers
   point there).
4. Wait for propagation — usually minutes, occasionally a few hours. HTTPS is
   issued automatically and free.

---

## Project layout

```
src/
├── app/
│   ├── layout.tsx        Fonts, <head> metadata, SEO and social preview tags
│   ├── page.tsx          Assembles the sections in order
│   └── globals.css       Design tokens, TED red, animations
├── components/
│   ├── Nav.tsx           Sticky bar, active-section highlighting, mobile drawer
│   ├── Hero.tsx          Title, theme, event details, countdown, main CTA
│   ├── Countdown.tsx     Live timer, hydration-safe
│   ├── EchoRings.tsx     Animated red rings that drift towards the cursor
│   ├── ScrollCue.tsx     "Scroll" nudge that fades out once you do
│   ├── ScrollProgress.tsx  Red progress bar across the top of the window
│   ├── Marquee.tsx       Ticker of theme words between sections
│   ├── About.tsx         What TEDx is + our event + the theme
│   ├── Speakers.tsx      Speaker card grid, opens the modal
│   ├── SpeakerModal.tsx  Full speaker profile, focus-trapped
│   ├── Stats.tsx         Four figures that count up on scroll
│   ├── Schedule.tsx      Alternating timeline for the day
│   ├── Register.tsx      Full-width call to action
│   ├── Team.tsx          Organizing team grid
│   ├── Footer.tsx        Links, contact, TED licence disclaimer
│   ├── BackToTop.tsx     Floating return-to-top button
│   ├── Section.tsx       Shared section shell — keeps spacing consistent
│   ├── Reveal.tsx        Fade-up on scroll
│   ├── Avatar.tsx        Photo, or initials when there is no photo
│   └── RegisterButton.tsx
├── hooks/
│   └── useScrollUi.ts    Scroll progress, active section, count-up
└── config/
    └── event.ts          ← all content lives here
```

---

## TED brand rules the site already follows

These are requirements of the TEDx licence, so please keep them intact when
editing:

- **"TEDx" is always TED red (`#EB0028`); the event name after it never is.**
  Handled by `Wordmark.tsx`.
- **No space** in `TEDxMIST`.
- The line **"x = independently organized TED event"** appears in the hero and
  the footer.
- The footer carries **"This independent TEDx event is operated under license
  from TED."**
- Red is the only accent colour on the site. Everything else is black, white and
  grey — this is intentional, not an unfinished palette.

---

## Accessibility notes

- Every section is reachable by keyboard, with a visible red focus ring.
- Animations are disabled automatically for anyone whose system is set to
  "reduce motion".
- The countdown is announced to screen readers as a timer.

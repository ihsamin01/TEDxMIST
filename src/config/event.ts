/**
 * ============================================================================
 *  TEDxMIST — SINGLE SOURCE OF TRUTH FOR ALL SITE CONTENT
 * ============================================================================
 *  Everything shown on the website is edited from this one file.
 *  You never need to touch the components to change text, dates or people.
 *
 *  After saving a change here, the dev server refreshes automatically.
 * ============================================================================
 */

/* ---------------------------------------------------------------------------
 * 1. THE BASICS
 * ------------------------------------------------------------------------ */

/**
 * Note on types: the objects below are deliberately NOT declared `as const`.
 * With `as const`, a field left as "" gets the literal type `""`, TypeScript
 * then decides any `if (x)` check around it can never pass, and the build
 * fails the moment you fill that field in. Plain `string` keeps every field
 * genuinely editable.
 */
/**
 * The address the site is served from, with no trailing slash.
 *
 * Search engines and social previews need absolute URLs, so this is what the
 * sitemap and the share cards are built from. Change it the day tedxmist.com
 * starts pointing here, and both follow.
 */
export const siteUrl = "https://tedxmist.vercel.app";

export const event: {
  name: string;
  theme: string;
  tagline: string;
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  venue: {
    name: string;
    hall: string;
    short: string;
    address: string;
    mapUrl: string;
    mapEmbedUrl: string;
  };
  organizer: { name: string; role: string; affiliation: string };
  contact: { email: string; phone: string };
} = {
  name: "TEDxMIST",
  theme: "Echoes of Tomorrow",
  tagline: "Today's choices shape the future we all inherit.",

  /**
   * The moment the countdown counts down to.
   * Format: YYYY-MM-DDTHH:mm:ss+06:00   ( +06:00 = Bangladesh Standard Time )
   * Change the time here if your doors open at a different hour.
   */
  startsAt: "2027-01-21T15:00:00+06:00",

  /** Shown as plain text in the hero and the schedule heading. */
  dateLabel: "21 January 2027",
  timeLabel: "3:00 PM - 7:00 PM",

  venue: {
    name: "Military Institute of Science and Technology (MIST)",
    /** The room itself, shown on the registration page and in the email. */
    hall: "Shaheed Yamin Auditorium",
    short: "MIST, Dhaka",
    address: "Mirpur Cantonment, Dhaka, Bangladesh",
    /**
     * Used by the "View on map" links. Google spells the hall "Shahid", not
     * "Shaheed", so the query has to match its spelling or it falls back to
     * the middle of the campus.
     */
    mapUrl:
      "https://maps.google.com/?q=Shahid+Yamin+Auditorium,+MIST,+Mirpur+Cantonment,+Dhaka",
    /**
     * The same hall as an <iframe> for the registration page. This uses the
     * building's plus code, which points at the auditorium itself rather than
     * somewhere in the middle of the campus.
     */
    mapEmbedUrl: "https://www.google.com/maps?q=R9Q4%2B5R8+Dhaka&output=embed",
  },

  organizer: {
    name: "Isbatul Haque Samin",
    role: "Licensee & Lead Organizer",
    affiliation: "Computer Science and Engineering, MIST",
  },

  contact: {
    /** Shown in the footer, and used as reply-to on confirmation emails. */
    email: "tedximistuniversity@gmail.com",
    phone: "",
  },
};

/* ---------------------------------------------------------------------------
 * 2. REGISTRATION
 * ------------------------------------------------------------------------ */

export const registration: {
  isOpen: boolean;
  capacity: number | null;
  fees: { mist: number; other: number };
  mistUniversity: string;
  currency: string;
  paymentMethods: string[];
  paymentNumber: string;
  tshirtSizes: string[];
  guidelines: string[];
  note: string;
} = {
  /** Set to false the moment you stop taking sign-ups. */
  isOpen: true,

  /**
   * How many people fit in the room. Null means no cap and no number shown
   * anywhere. Put the agreed figure here to turn the limit back on.
   */
  capacity: null,

  /**
   * What a seat costs. MIST students pay the lower rate; everyone else pays
   * the other one. Which rate applies is worked out on the server from the
   * university they picked, never from anything the browser sends.
   */
  fees: {
    mist: 150,
    other: 400,
  },

  /**
   * The university that qualifies for the MIST rate. This has to match the
   * entry in config/universities.ts character for character.
   */
  mistUniversity: "Military Institute of Science and Technology (MIST)",

  /** Printed in front of every amount. */
  currency: "BDT",

  /**
   * How people are allowed to pay. With one entry the form stops being a
   * dropdown and simply states it; add a second and the dropdown comes back
   * on its own.
   */
  paymentMethods: ["bKash"],

  /**
   * The number attendees send the fee to, shown on the payment step.
   * Leave it as "" and the payment instructions box is hidden.
   */
  paymentNumber: "01827724421",

  /** The options in the T-shirt dropdown. */
  tshirtSizes: ["S", "M", "L", "XL", "XXL"],

  /** Shown as a checklist on the payment step and repeated in the email. */
  guidelines: [
    "Be at the venue at least 30 minutes before the programme starts.",
    "Bring your student ID and the phone number you registered with.",
    "Your seat is confirmed only after we verify your transaction ID.",
    "Seats are not transferable and the fee is non-refundable.",
  ],

  /** Small line printed under the button. */
  note: "In-person seats are limited and allocated first come, first served.",
};

/**
 * What this person owes, from the university they picked.
 *
 * Both the payment step and the server call this, so the amount shown on
 * screen and the amount stored on the row can never disagree.
 */
export function feeFor(university: string): number {
  return university === registration.mistUniversity
    ? registration.fees.mist
    : registration.fees.other;
}

/* ---------------------------------------------------------------------------
 * 3. ABOUT COPY
 * ------------------------------------------------------------------------ */

export const about = {
  /** The short paragraph under the wordmark in the footer. */
  footerBlurb:
    "TEDxMIST is an independently organized TED event, bringing engineers, researchers, artists and storytellers to one stage at MIST to share ideas worth spreading.",

  /** The line the About section leads with, set in large type. */
  headline: "An echo is a sound that took the long way back.",

  /** The paragraph under it. */
  ourEvent: `You make it, it leaves, and for a while you hear nothing at all. Then it returns, carrying everything it touched on the way. TEDxMIST is the first TEDx event ever held at the Military Institute of Science and Technology, a campus full of people who build things that will outlast them.`,

  /** What the theme means. Shown in its own highlighted block. */
  themeMeaning: `Decisions behave the same way. A line of code. A policy. A bridge. A choice to speak up or to keep quiet. None of them stay where we left them. They travel out past the room, past the year, past the people who made them, and they land somewhere we will never stand, in the hands of a generation nobody thought to consult. So we are putting one uncomfortable question to everyone who takes our stage. What are you sending forward, and who will have to hear it?`,
} as const;

/* ---------------------------------------------------------------------------
 * 4. SPEAKERS
 * ------------------------------------------------------------------------ */

export type Speaker = {
  name: string;
  /** Job title / what they do. */
  title: string;
  /** The title of their talk. */
  topic: string;
  /** Two or three sentences. */
  bio: string;
  /**
   * Optional headshot. Drop the image in the `public/speakers/` folder and
   * write the path here, e.g. "/speakers/ayesha.jpg".
   * If left out, the card shows their initials on a red gradient instead —
   * which looks intentional, so unconfirmed photos are not a problem.
   */
  photo?: string;
};

/**
 * Replace these with your real speakers as they get confirmed.
 * Add or delete entries freely — the grid reflows on its own.
 */
export const speakers: Speaker[] = [
  {
    name: "Speaker One",
    title: "Job title, Organization",
    topic: "The title of their talk goes here",
    bio: "Two or three sentences about who they are and why this audience should listen to them. Keep every bio roughly the same length so the cards line up neatly.",
  },
  {
    name: "Speaker Two",
    title: "Job title, Organization",
    topic: "The title of their talk goes here",
    bio: "Two or three sentences about who they are and why this audience should listen to them. Keep every bio roughly the same length so the cards line up neatly.",
  },
  {
    name: "Speaker Three",
    title: "Job title, Organization",
    topic: "The title of their talk goes here",
    bio: "Two or three sentences about who they are and why this audience should listen to them. Keep every bio roughly the same length so the cards line up neatly.",
  },
  {
    name: "Speaker Four",
    title: "Job title, Organization",
    topic: "The title of their talk goes here",
    bio: "Two or three sentences about who they are and why this audience should listen to them. Keep every bio roughly the same length so the cards line up neatly.",
  },
  {
    name: "Speaker Five",
    title: "Job title, Organization",
    topic: "The title of their talk goes here",
    bio: "Two or three sentences about who they are and why this audience should listen to them. Keep every bio roughly the same length so the cards line up neatly.",
  },
  {
    name: "Speaker Six",
    title: "Job title, Organization",
    topic: "The title of their talk goes here",
    bio: "Two or three sentences about who they are and why this audience should listen to them. Keep every bio roughly the same length so the cards line up neatly.",
  },
];

/* ---------------------------------------------------------------------------
 * 5. SCHEDULE
 * ------------------------------------------------------------------------ */

export type Slot = {
  time: string;
  title: string;
  detail?: string;
  /** `true` draws the slot in TED red — use it for the talk sessions. */
  highlight?: boolean;
};

/** Placeholder running order. Edit the times and titles as the day firms up. */
export const schedule: Slot[] = [
  {
    time: "14:30",
    title: "Registration & Welcome Coffee",
    detail: "Badge pickup at the auditorium lobby.",
  },
  {
    time: "15:00",
    title: "Opening Remarks",
    detail: "A word from the organizing team and the MIST administration.",
  },
  {
    time: "15:15",
    title: "Session One: Foundations",
    detail: "Three talks, followed by a short TED Talk screening.",
    highlight: true,
  },
  {
    time: "16:15",
    title: "Break & Networking",
    detail: "Refreshments in the lobby. Prayer space available.",
  },
  {
    time: "16:45",
    title: "Session Two: Signals",
    detail: "Three talks exploring what today is already sending forward.",
    highlight: true,
  },
  {
    time: "17:45",
    title: "Interactive Break",
    detail: "Installations, sponsor booths and coffee.",
  },
  {
    time: "18:00",
    title: "Session Three: Echoes",
    detail: "Closing talks and an on-stage conversation with the speakers.",
    highlight: true,
  },
  {
    time: "18:45",
    title: "Closing & Group Photo",
  },
];

/* ---------------------------------------------------------------------------
 * 7. SOCIAL LINKS
 * ------------------------------------------------------------------------ */

/** Leave a url as "" and that icon simply will not render. */
export const socials: {
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  ted: string;
} = {
  facebook: "",
  instagram: "",
  linkedin: "",
  youtube: "",
  /** The official TEDxMIST listing on TED's own site. */
  ted: "https://www.ted.com/tedx/events/70695",
};

/* ---------------------------------------------------------------------------
 * 8. NAVIGATION
 * ------------------------------------------------------------------------ */

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Schedule", href: "#schedule" },
] as const;

/* ---------------------------------------------------------------------------
 * 9. MARQUEE
 * ------------------------------------------------------------------------ */

/**
 * The words that scroll past in the ticker strips between sections.
 * Keep them short — one or two words each reads best in motion.
 */
export const marqueeWords: string[] = [
  "Ideas worth spreading",
  "Echoes of Tomorrow",
  "One stage",
  "One day",
  "MIST, Dhaka",
  "21 January 2027",
];

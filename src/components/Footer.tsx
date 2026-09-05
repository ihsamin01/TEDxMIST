import Link from "next/link";
import { about, event, navLinks, socials } from "@/config/event";

/* Brand marks for the social row. */

const SOCIAL_ICONS: Record<string, string> = {
  facebook:
    "M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z",
  instagram:
    "M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5-1.05a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0ZM7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z",
  linkedin:
    "M7 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM5.5 10h3v10h-3V10Zm5.5 0h2.9v1.4a3.2 3.2 0 0 1 2.85-1.5c2.2 0 3.75 1.4 3.75 4.3V20h-3v-5.2c0-1.35-.5-2.2-1.7-2.2-1 0-1.55.68-1.8 1.35-.1.24-.1.57-.1.9V20h-3V10Z",
  youtube:
    "M21.5 8.4a2.6 2.6 0 0 0-1.8-1.85C18.1 6.1 12 6.1 12 6.1s-6.1 0-7.7.45A2.6 2.6 0 0 0 2.5 8.4 27 27 0 0 0 2.05 12c0 1.25.15 2.45.45 3.6a2.6 2.6 0 0 0 1.8 1.85c1.6.45 7.7.45 7.7.45s6.1 0 7.7-.45a2.6 2.6 0 0 0 1.8-1.85c.3-1.15.45-2.35.45-3.6s-.15-2.45-.45-3.6ZM10.2 14.9V9.1l5 2.9-5 2.9Z",
};

/** The Legal column, in the order TEDx event sites usually list them. */
const LEGAL_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacy" },
];

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

/* Small line-art marks beside each contact detail. */

const iconClass = "h-4 w-4 shrink-0 text-ted";

function MailIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClass}
    >
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-base font-bold tracking-tight text-white">
      {children}
    </h2>
  );
}

function SocialLinks() {
  const active = (
    Object.keys(SOCIAL_ICONS) as Array<keyof typeof socials>
  ).filter((key) => socials[key]);

  if (active.length === 0 && !socials.ted) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {active.map((key) => (
        <a
          key={key}
          href={socials[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={SOCIAL_LABELS[key]}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink-soft text-white/80 transition hover:-translate-y-0.5 hover:border-ted hover:text-ted"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d={SOCIAL_ICONS[key]} />
          </svg>
        </a>
      ))}

      {socials.ted && (
        <a
          href={socials.ted}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="This event on TED.com"
          className="flex h-10 items-center rounded-full border border-line bg-ink-soft px-4 text-xs font-bold tracking-tight text-white/80 transition hover:-translate-y-0.5 hover:border-ted hover:text-ted"
        >
          TED.com
        </a>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 pt-14 pb-10 sm:px-6 md:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr] md:gap-10">
          {/* Who we are */}
          <div>
            <p className="text-3xl font-black tracking-tight">
              <span className="text-ted">TEDx</span>
              <span className="text-white">MIST</span>
            </p>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {about.footerBlurb}
            </p>

            <div className="mt-7">
              <SocialLinks />
            </div>
          </div>

          {/* Where to go */}
          <nav>
            <ColumnHeading>Quick Links</ColumnHeading>

            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${link.href}`}
                    className="text-sm text-muted transition-colors hover:text-ted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/register"
                  className="text-sm text-muted transition-colors hover:text-ted"
                >
                  Register
                </Link>
              </li>
            </ul>
          </nav>

          {/* The small print */}
          <nav>
            <ColumnHeading>Legal</ColumnHeading>

            <ul className="space-y-3.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-ted"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* How to reach us */}
          <div>
            <ColumnHeading>Contact Information</ColumnHeading>

            <ul className="space-y-3.5 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MailIcon />
                <a
                  href={`mailto:${event.contact.email}`}
                  className="transition-colors hover:text-ted"
                >
                  {event.contact.email}
                </a>
              </li>

              {event.contact.phone && (
                <li className="flex items-start gap-3">
                  <PhoneIcon />
                  <a
                    href={`tel:${event.contact.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-ted"
                  >
                    {event.contact.phone}
                  </a>
                </li>
              )}

              <li className="flex items-start gap-3">
                <PinIcon />
                <a
                  href={event.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leading-relaxed transition-colors hover:text-ted"
                >
                  {event.venue.hall}
                  <br />
                  {event.venue.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* The line TED requires on every TEDx event site. */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="text-center text-sm text-muted">
            © {new Date().getFullYear()} {event.name}. This independent TEDx
            event is operated under license from TED.
          </p>
        </div>
      </div>
    </footer>
  );
}

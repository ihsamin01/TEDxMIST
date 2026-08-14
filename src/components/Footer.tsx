import { event, navLinks, socials } from "@/config/event";

/** Icon paths, keyed to match the fields in `socials`. */
const ICONS: Record<string, string> = {
  facebook:
    "M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2a1 1 0 0 1 1-1Z",
  instagram:
    "M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5-1.05a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0ZM7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Z",
  linkedin:
    "M7 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM5.5 10h3v10h-3V10Zm5.5 0h2.9v1.4a3.2 3.2 0 0 1 2.85-1.5c2.2 0 3.75 1.4 3.75 4.3V20h-3v-5.2c0-1.35-.5-2.2-1.7-2.2-1 0-1.55.68-1.8 1.35-.1.24-.1.57-.1.9V20h-3V10Z",
  youtube:
    "M21.5 8.4a2.6 2.6 0 0 0-1.8-1.85C18.1 6.1 12 6.1 12 6.1s-6.1 0-7.7.45A2.6 2.6 0 0 0 2.5 8.4 27 27 0 0 0 2.05 12c0 1.25.15 2.45.45 3.6a2.6 2.6 0 0 0 1.8 1.85c1.6.45 7.7.45 7.7.45s6.1 0 7.7-.45a2.6 2.6 0 0 0 1.8-1.85c.3-1.15.45-2.35.45-3.6s-.15-2.45-.45-3.6ZM10.2 14.9V9.1l5 2.9-5 2.9Z",
};

const LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

function SocialLinks() {
  // Only the platforms that actually have a URL filled in.
  const active = (Object.keys(ICONS) as Array<keyof typeof socials>).filter(
    (key) => socials[key],
  );

  if (active.length === 0 && !socials.ted) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {active.map((key) => (
        <a
          key={key}
          href={socials[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={LABELS[key]}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-white/70 transition hover:-translate-y-0.5 hover:border-ted hover:text-ted"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d={ICONS[key]} />
          </svg>
        </a>
      ))}

      {socials.ted && (
        <a
          href={socials.ted}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center rounded-full border border-line px-5 text-sm font-bold tracking-tight text-white/70 transition hover:-translate-y-0.5 hover:border-ted hover:text-ted"
        >
          TED.com
        </a>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-16 text-center sm:px-6 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Identity */}
        <p className="text-3xl font-black tracking-tight md:text-4xl">
          <span className="text-ted">TEDx</span>
          <span className="text-white">MIST</span>
        </p>

        <p className="mx-auto mt-4 max-w-md leading-relaxed text-balance text-muted">
          {event.theme} — {event.dateLabel} at {event.venue.short}.
        </p>

        <div className="mt-8">
          <SocialLinks />
        </div>

        {/* Navigation */}
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/70 transition-colors hover:text-ted"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#register"
            className="text-sm font-semibold text-white/70 transition-colors hover:text-ted"
          >
            Register
          </a>
        </nav>

        {/* Contact */}
        <div className="mt-12 flex flex-col items-center gap-2.5 text-sm text-muted">
          <a
            href={`mailto:${event.contact.email}`}
            className="transition-colors hover:text-ted"
          >
            {event.contact.email}
          </a>

          {event.contact.phone && (
            <a
              href={`tel:${event.contact.phone.replace(/\s/g, "")}`}
              className="transition-colors hover:text-ted"
            >
              {event.contact.phone}
            </a>
          )}

          <p className="max-w-xs leading-relaxed text-balance">
            {event.venue.address}
          </p>

          <a
            href={event.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ted transition-opacity hover:opacity-75"
          >
            View on map
          </a>
        </div>

        {/* Legal — the disclaimer TED requires on every TEDx event site. */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-balance text-muted">
            This independent TEDx event is operated under license from TED.
          </p>

          <div className="mt-4 flex flex-col items-center gap-2 text-xs text-muted sm:text-sm">
            <p className="text-balance">
              © {new Date().getFullYear()} {event.name}. Organized by{" "}
              {event.organizer.name}.
            </p>
            <p>x = independently organized TED event</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

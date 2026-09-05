import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { about, event } from "@/config/event";

export const metadata: Metadata = {
  title: "About Us",
  description: `Who organizes ${event.name}, and under what licence.`,
};

export default function AboutUsPage() {
  return (
    <LegalPage
      title="About Us"
      intro={`Who runs ${event.name}, what it is, and how to reach the people behind it.`}
    >
      <LegalSection n={1} title="The event">
        <p>{about.ourEvent}</p>
        <p>
          It takes place on {event.dateLabel}, {event.timeLabel}, at{" "}
          {event.venue.hall}, {event.venue.name}, {event.venue.address}.
        </p>
      </LegalSection>

      <LegalSection n={2} title="What a TEDx event is">
        <p>
          In the spirit of ideas worth spreading, TEDx is a programme of local,
          self-organized events that bring people together to share a TED-like
          experience. At a TEDx event, TED Talks video and live speakers combine
          to spark deep discussion and connection. These local, self-organized
          events are branded TEDx, where x = independently organized TED event.
        </p>
        <p>
          The TED Conference provides general guidance for the TEDx programme,
          but individual TEDx events are self-organized, subject to certain rules
          and regulations.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Who we are">
        <p>
          {event.name} is organized independently by students of{" "}
          {event.venue.name}. It is not run by, funded by, or speaking for the
          institute, and the views of our speakers are their own.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Our licence">
        <p>
          This independent TEDx event is operated under license from TED. The
          licence is a University licence, which sets the rules we run under,
          including how the event is named and branded and how large the
          audience may be.
        </p>
        <p>
          Our listing on TED&apos;s own site is at{" "}
          <a
            href="https://www.ted.com/tedx/events/70695"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ted hover:underline"
          >
            ted.com/tedx/events/70695
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection n={5} title="Contact">
        <p>
          Write to{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="font-semibold text-ted hover:underline"
          >
            {event.contact.email}
          </a>
          {event.contact.phone ? `, or call ${event.contact.phone}` : ""}. For
          anything about a registration, see the{" "}
          <Link
            href="/refund-policy"
            className="font-semibold text-ted hover:underline"
          >
            refund policy
          </Link>{" "}
          and the{" "}
          <Link
            href="/terms"
            className="font-semibold text-ted hover:underline"
          >
            terms
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

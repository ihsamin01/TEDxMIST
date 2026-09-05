import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, {
  LegalBullets,
  LegalSection,
} from "@/components/LegalPage";
import { event, refundPolicy, registration } from "@/config/event";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms you agree to when registering for ${event.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro={`What you agree to when you register for ${event.name}, and what we commit to in return.`}
      lastUpdated={refundPolicy.lastUpdated}
    >
      <LegalSection n={1} title="Registering">
        <p>
          Submitting the registration form means you accept these terms. You
          must give accurate details, and the student ID you upload must be your
          own. Registrations with details we cannot verify are rejected, and the
          fee returned.
        </p>
        <p>
          Registering is not the same as having a seat. A seat is confirmed only
          after we match your bKash transaction ID against our records and email
          you a ticket number.
        </p>
      </LegalSection>

      <LegalSection n={2} title="The fee">
        <p>
          The fee is {registration.currency} {registration.fees.mist} for MIST
          students and {registration.currency} {registration.fees.other} for
          everyone else. Which rate applies is decided from the university you
          select, not from what you tell us afterwards.
        </p>
        <p>
          Refunds are covered separately in the{" "}
          <Link
            href="/refund-policy"
            className="font-semibold text-ted hover:underline"
          >
            refund policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection n={3} title="Your ticket">
        <p>
          Your ticket number admits one person. Seats are not transferable and
          cannot be resold. Bring your student ID and the phone number you
          registered with.
        </p>
        <p>
          Doors open thirty minutes before the programme starts and the
          registration desk closes when the first talk begins. We cannot promise
          to admit anyone who arrives after that.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Behaviour at the event">
        <p>
          {event.venue.name} is a working campus and we are guests in it. You
          agree to follow campus rules and the instructions of the organizing
          team and venue staff.
        </p>
        <p>We may ask you to leave, without a refund, for:</p>
        <LegalBullets
          items={[
            "Harassment of speakers, attendees, volunteers or staff.",
            "Disrupting a talk or the running of the event.",
            "Damaging the venue or its equipment.",
            "Bringing anything prohibited on the campus.",
          ]}
        />
      </LegalSection>

      <LegalSection n={5} title="Photography and filming">
        <p>
          TEDx events are recorded. Talks are filmed for TED, and we photograph
          the audience and the venue. Attending means you agree that your image
          and voice may appear in those recordings and photographs, and that
          they may be published by us or by TED, without payment.
        </p>
        <p>
          If you would rather not be filmed, tell us at the registration desk on
          the day and we will seat you away from the cameras.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Changes to the programme">
        <p>
          Speakers, the running order and the timings are subject to change. A
          speaker withdrawing, or the order shifting, is not grounds for a
          refund.
        </p>
        <p>
          If we change the date, or cancel altogether, the refund policy
          applies.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Your belongings and your safety">
        <p>
          Bring only what you need. We do not have a cloakroom and we are not
          responsible for anything lost, stolen or damaged at the venue.
        </p>
        <p>
          Tell us on the form who to call in an emergency. If you have a medical
          condition or an access need we should know about, email us before the
          day so we can plan for it.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Who we are, and what we are not">
        <p>
          {event.name} is organized independently by students under licence from
          TED. TED does not run this event, and neither does{" "}
          {event.venue.name}. The views expressed on our stage belong to the
          speakers.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Changes to these terms">
        <p>
          We may update this page. The version that applies to you is the one
          published on the day you registered. Questions go to{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="font-semibold text-ted hover:underline"
          >
            {event.contact.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

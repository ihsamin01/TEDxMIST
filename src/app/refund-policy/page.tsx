import type { Metadata } from "next";
import LegalPage, {
  LegalBullets,
  LegalSection,
} from "@/components/LegalPage";
import { event, refundPolicy, registration } from "@/config/event";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `When registration fees for ${event.name} are refunded, and how to ask.`,
};

export default function RefundPolicyPage() {
  const { mist, other } = registration.fees;
  const money = (amount: number) => `${registration.currency} ${amount}`;

  return (
    <LegalPage
      title="Refund Policy"
      intro={`When a registration fee for ${event.name} is refunded, how to ask for one, and how long it takes.`}
      lastUpdated={refundPolicy.lastUpdated}
    >
      <LegalSection n={1} title="What you are paying for">
        <p>
          Registration buys one seat at {event.name} on {event.dateLabel} at{" "}
          {event.venue.hall}, {event.venue.name}. The fee is {money(mist)} for
          MIST students and {money(other)} for everyone else, paid by bKash to{" "}
          {registration.paymentNumber || "the number shown on the form"} before a
          seat is held.
        </p>
        <p>
          A seat is confirmed only once we have matched your transaction ID
          against our records. Until then you are on the list but not yet
          confirmed.
        </p>
      </LegalSection>

      <LegalSection n={2} title="When we refund you in full">
        <p>
          In these cases you get the whole fee back without having to argue for
          it:
        </p>
        <LegalBullets
          items={[
            "We cancel the event, or move it to a date you cannot attend.",
            "We reject your registration, for any reason, after you have paid.",
            "You paid twice for the same registration.",
            "You were charged the wrong rate. We return the difference.",
          ]}
        />
        <p>
          For a cancellation or a rejection you do not need to ask. We contact
          you and send the money back.
        </p>
      </LegalSection>

      <LegalSection n={3} title="When we do not refund you">
        <p>
          Seats are limited and turning one away close to the day means it goes
          empty, so the fee is otherwise non-refundable:
        </p>
        <LegalBullets
          items={[
            "You change your mind, or something comes up and you cannot attend.",
            "You do not turn up on the day.",
            "You arrive too late to be admitted.",
            "You are asked to leave for behaviour that breaks the event rules.",
          ]}
        />
        <p>
          Seats are also not transferable. The name on the registration is the
          person we admit.
        </p>
      </LegalSection>

      <LegalSection n={4} title="How to ask for a refund">
        <p>
          Write to{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="font-semibold text-ted hover:underline"
          >
            {event.contact.email}
          </a>{" "}
          from the email address you registered with, within{" "}
          {refundPolicy.requestWindowDays} days of paying. Tell us:
        </p>
        <LegalBullets
          items={[
            "Your full name and the phone number you registered with.",
            "The bKash transaction ID you entered on the form.",
            "Which of the cases above applies, in a sentence.",
          ]}
        />
        <p>
          We reply within two to three working days to say whether the claim is
          approved.
        </p>
      </LegalSection>

      <LegalSection n={5} title="How the money comes back">
        <p>
          Approved refunds are sent by bKash to the number the payment came
          from, within {refundPolicy.processingDays} working days of approval.
          We do not send refunds to a different number than the one that paid.
        </p>
        <p>
          Any bKash charge on the original payment is not ours to return, so the
          amount you receive may be very slightly less than the amount you sent.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Disputed and fraudulent claims">
        <p>
          If a transaction ID cannot be found, has already been used by another
          registration, or does not match the amount owed, we hold the
          registration and ask you about it before doing anything else.
        </p>
        <p>
          Claiming a refund for a payment you did not make, or using someone
          else&apos;s transaction ID, cancels the registration.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Changes to this policy">
        <p>
          We may update this page. The terms that apply to you are the ones
          published on the day you registered, and the date at the top says when
          this version was last changed.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Questions">
        <p>
          Anything here that is unclear, write to{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="font-semibold text-ted hover:underline"
          >
            {event.contact.email}
          </a>
          . {event.name} is organized by students at {event.venue.name}, and we
          would rather sort a problem out over email than leave you guessing.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

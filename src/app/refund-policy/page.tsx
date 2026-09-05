import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import SiteBackdrop from "@/components/SiteBackdrop";
import { event, refundPolicy, registration } from "@/config/event";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `How registration fees are refunded for ${event.name}.`,
};

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-lg font-black tracking-tight sm:text-xl">
        <span className="mr-3 text-ted">{n}.</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ted"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function RefundPolicyPage() {
  const { mist, other } = registration.fees;
  const money = (amount: number) => `${registration.currency} ${amount}`;

  return (
    <>
      <SiteBackdrop />

      <header className="relative z-10 border-b border-line">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-6 md:h-20">
          <Link
            href="/"
            className="text-xl font-black tracking-tight whitespace-nowrap md:text-2xl"
          >
            <span className="text-ted">TEDx</span>
            <span className="text-white">MIST</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-muted transition-colors hover:text-ted"
          >
            Back to the site
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-5 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-[0.65rem] font-bold tracking-[0.25em] text-ted uppercase sm:text-xs">
            Legal
          </p>

          <h1 className="text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] font-black tracking-tight text-balance">
            Refund Policy
          </h1>

          <p className="mt-6 text-base leading-relaxed text-white/70 sm:text-lg">
            This page explains when a registration fee for {event.name} is
            refunded, how to ask for one, and how long it takes.
          </p>

          <p className="mt-3 text-sm text-muted">
            Last updated: {refundPolicy.lastUpdated}
          </p>

          <div className="mt-14 space-y-10">
            <Section n={1} title="What you are paying for">
              <p>
                Registration buys one seat at {event.name} on {event.dateLabel}{" "}
                at {event.venue.hall}, {event.venue.name}. The fee is{" "}
                {money(mist)} for MIST students and {money(other)} for everyone
                else, and it is paid by bKash to{" "}
                {registration.paymentNumber || "the number shown on the form"}{" "}
                before a seat is held.
              </p>
              <p>
                A seat is confirmed only once we have matched your transaction
                ID against our records. Until then you are on the list but not
                yet confirmed.
              </p>
            </Section>

            <Section n={2} title="When we refund you in full">
              <p>
                In these cases you get the whole fee back without having to
                argue for it:
              </p>
              <Bullets
                items={[
                  "We cancel the event, or move it to a date you cannot attend.",
                  "We reject your registration, for any reason, after you have paid.",
                  "You paid twice for the same registration.",
                  "You were charged the wrong rate. We return the difference.",
                ]}
              />
              <p>
                For a cancellation or a rejection you do not need to ask. We
                contact you and send the money back.
              </p>
            </Section>

            <Section n={3} title="When we do not refund you">
              <p>
                Seats are limited and turning one away close to the day means it
                goes empty, so the fee is otherwise non-refundable:
              </p>
              <Bullets
                items={[
                  "You change your mind, or something comes up and you cannot attend.",
                  "You do not turn up on the day.",
                  "You arrive too late to be admitted.",
                  "You are asked to leave for behaviour that breaks the event rules.",
                ]}
              />
              <p>
                Seats are also not transferable. The name on the registration is
                the person we admit.
              </p>
            </Section>

            <Section n={4} title="How to ask for a refund">
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
              <Bullets
                items={[
                  "Your full name and the phone number you registered with.",
                  "The bKash transaction ID you entered on the form.",
                  "Which of the cases above applies, in a sentence.",
                ]}
              />
              <p>
                We reply within two to three working days to say whether the
                claim is approved.
              </p>
            </Section>

            <Section n={5} title="How the money comes back">
              <p>
                Approved refunds are sent by bKash to the number the payment
                came from, within {refundPolicy.processingDays} working days of
                approval. We do not send refunds to a different number than the
                one that paid.
              </p>
              <p>
                Any bKash charge on the original payment is not ours to return,
                so the amount you receive may be very slightly less than the
                amount you sent.
              </p>
            </Section>

            <Section n={6} title="Disputed and fraudulent claims">
              <p>
                If a transaction ID cannot be found, has already been used by
                another registration, or does not match the amount owed, we hold
                the registration and ask you about it before doing anything
                else.
              </p>
              <p>
                Claiming a refund for a payment you did not make, or using
                someone else&apos;s transaction ID, cancels the registration.
              </p>
            </Section>

            <Section n={7} title="Changes to this policy">
              <p>
                We may update this page. The terms that apply to you are the
                ones published on the day you registered, and the date at the
                top says when this version was last changed.
              </p>
            </Section>

            <Section n={8} title="Questions">
              <p>
                Anything here that is unclear, write to{" "}
                <a
                  href={`mailto:${event.contact.email}`}
                  className="font-semibold text-ted hover:underline"
                >
                  {event.contact.email}
                </a>
                . {event.name} is organized by students at {event.venue.name},
                and we would rather sort a problem out over email than leave you
                guessing.
              </p>
            </Section>
          </div>

          <div className="mt-14 border-t border-line pt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 rounded-full border border-line px-6 py-3 text-sm font-bold transition hover:border-ted hover:text-ted"
            >
              Back to registration
            </Link>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}

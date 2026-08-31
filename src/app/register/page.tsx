import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import { event, registration } from "@/config/event";
import { isSupabaseConfigured } from "@/lib/supabase";
import { seatsLeft } from "./actions";

export const metadata: Metadata = {
  title: "Register",
  description: `Reserve your seat at ${event.name}. ${event.theme}, ${event.dateLabel} at ${event.venue.short}.`,
};

/** Seat count has to be read fresh each visit. */
export const dynamic = "force-dynamic";

/** Slim header, no nav. */
function PageHeader() {
  return (
    <header className="border-b border-line">
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
  );
}

/** Replaces the form when sign-ups are shut. */
function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-soft p-10 text-center sm:p-14">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-pretty text-white/70">{body}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold transition hover:border-ted hover:text-ted"
      >
        Back to the site
      </Link>
    </div>
  );
}

export default async function RegisterPage() {
  const remaining = registration.isOpen ? await seatsLeft() : null;
  const soldOut = remaining === 0;

  return (
    <>
      <PageHeader />

      <main className="relative overflow-hidden px-5 py-16 sm:px-6 md:py-24">
        {/* Same red wash as the landing page. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(235,0,40,0.18),transparent_65%)]"
        />

        <div className="relative mx-auto max-w-3xl">
          <p className="mb-5 text-[0.65rem] font-bold tracking-[0.25em] text-ted uppercase sm:text-xs">
            Attend
          </p>

          <h1 className="text-[clamp(2rem,7vw,3.5rem)] leading-[1.05] font-black tracking-tight text-balance">
            Reserve your seat
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
            {event.theme}, on {event.dateLabel} at {event.venue.short}. A few
            details and we can hold a seat for you.
          </p>

          {/* Hidden if there's no capacity set, or the database is down. */}
          {remaining !== null && remaining > 0 && (
            <p className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-ink-soft px-5 py-2.5 text-sm font-semibold">
              <span aria-hidden className="h-2 w-2 rounded-full bg-ted" />
              {remaining} seats left
            </p>
          )}

          <div className="mt-14">
            {!registration.isOpen ? (
              <Notice
                title="Registration is closed"
                body={`Sign-ups for ${event.name} are no longer open. Follow us on social media for the next event.`}
              />
            ) : !isSupabaseConfigured ? (
              <Notice
                title="Registration is opening soon"
                body="The form is not accepting entries yet. Please check back shortly."
              />
            ) : soldOut ? (
              <Notice
                title="All seats are taken"
                body={`Registration is full. Email ${event.contact.email} to be added to the waiting list.`}
              />
            ) : (
              <RegisterForm />
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-line px-5 py-10 text-center sm:px-6">
        <p className="text-xs leading-relaxed text-muted">
          This independent TEDx event is operated under license from TED.
        </p>
      </footer>
    </>
  );
}

import Link from "next/link";
import Footer from "./Footer";
import SiteBackdrop from "./SiteBackdrop";

/**
 * The shell every legal page sits in: About Us, Terms, Privacy, Refund.
 *
 * They are four pages with identical chrome, so the header, the heading block
 * and the numbered section styling live here once rather than four times.
 */

export function LegalSection({
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

export function LegalBullets({ items }: { items: string[] }) {
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

type Props = {
  title: string;
  intro: string;
  /** Printed under the intro. Left out on pages that are not dated. */
  lastUpdated?: string;
  children: React.ReactNode;
};

export default function LegalPage({
  title,
  intro,
  lastUpdated,
  children,
}: Props) {
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
            {title}
          </h1>

          <p className="mt-6 text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
            {intro}
          </p>

          {lastUpdated && (
            <p className="mt-3 text-sm text-muted">Last updated: {lastUpdated}</p>
          )}

          <div className="mt-14 space-y-10">{children}</div>

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

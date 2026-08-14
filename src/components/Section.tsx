import Reveal from "./Reveal";

type Props = {
  id: string;
  /** Small red label above the heading, e.g. "02 — Speakers". */
  eyebrow?: string;
  title: string;
  /** Optional paragraph under the heading. */
  intro?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * The standard section wrapper: consistent vertical rhythm, max width and
 * centred heading treatment. Every section is built from this, which is what
 * keeps the spacing identical the whole way down the page.
 */
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-line px-5 py-20 sm:px-6 md:py-32 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
            {eyebrow && (
              <p className="mb-4 flex items-center justify-center gap-3 text-[0.65rem] font-bold tracking-[0.25em] text-ted uppercase sm:text-xs">
                <span aria-hidden className="h-px w-6 bg-ted/50" />
                {eyebrow}
                <span aria-hidden className="h-px w-6 bg-ted/50" />
              </p>
            )}

            <h2 className="text-[clamp(2rem,7vw,3.75rem)] leading-[1.05] font-black tracking-tight text-balance">
              {title}
            </h2>

            {intro && (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-balance text-muted sm:text-lg md:text-xl">
                {intro}
              </p>
            )}
          </header>
        </Reveal>

        {children}
      </div>
    </section>
  );
}

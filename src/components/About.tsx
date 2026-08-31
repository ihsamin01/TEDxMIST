import CursorGlow from "./CursorGlow";
import Reveal from "./Reveal";
import Section from "./Section";
import WordReveal from "./WordReveal";
import { about, event } from "@/config/event";

/**
 * Rings leaving the red dot. Slower and tighter than the hero's, so the two
 * read as the same idea at different volumes rather than as a copy.
 */
function DotEcho() {
  const rings = [0, 1.75, 3.5, 5.25];

  return (
    <span
      aria-hidden
      className="relative mx-auto flex h-2.5 w-2.5 items-center justify-center"
    >
      {rings.map((delay) => (
        <span
          key={delay}
          className="echo-ripple absolute h-32 w-32 rounded-full border border-ted sm:h-44 sm:w-44"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}

      <span className="pulse-dot absolute top-1/2 left-1/2 h-2.5 w-2.5 rounded-full bg-ted shadow-[0_0_30px_9px_rgba(235,0,40,0.4)]" />
    </span>
  );
}

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="01 / About"
      title={`About ${event.name}`}
      intro="An independently organized TEDx event, hosted on the MIST campus in Mirpur Cantonment."
    >
      {/*
        The statement sits in its own field so the pointer glow and the rings
        have somewhere to live without spilling into the theme block below.
      */}
      <div className="relative isolate overflow-hidden py-10 sm:py-16">
        <CursorGlow />

        <div className="relative mx-auto max-w-3xl text-center">
          <DotEcho />

          <WordReveal
            text={about.headline}
            className="mt-16 text-[clamp(1.6rem,5.5vw,2.75rem)] leading-[1.12] font-black tracking-tight text-balance sm:mt-24"
            stagger={80}
          />

          <span aria-hidden className="mx-auto mt-9 block h-px w-16 bg-line" />

          <Reveal delay={140}>
            <p className="mt-9 text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
              {about.ourEvent}
            </p>
          </Reveal>
        </div>
      </div>

      {/* The theme, given its own weight on the page. */}
      <Reveal delay={120}>
        <figure className="relative isolate mt-12 overflow-hidden rounded-3xl border border-line bg-ink-soft px-6 py-14 text-center sm:px-12 md:mt-20 md:py-20">
          {/* A red wash that keeps moving, so the block never sits still. */}
          <div
            aria-hidden
            className="bloom-drift absolute inset-[-25%] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.2),transparent_62%)]"
          />

          {/* Faint rings, far slower than the ones above. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {[0, 4, 8].map((delay) => (
              <span
                key={delay}
                className="echo-ripple absolute h-[420px] w-[420px] rounded-full border border-ted/25"
                style={{ animationDelay: `${delay}s`, animationDuration: "12s" }}
              />
            ))}
          </div>

          <div className="relative">
            <figcaption className="mb-6 text-xs font-bold tracking-[0.25em] text-ted uppercase">
              The theme
            </figcaption>

            <WordReveal
              text={event.theme}
              className="mx-auto max-w-3xl text-[clamp(1.9rem,7vw,3.5rem)] leading-[1.05] font-black tracking-tight text-balance"
              stagger={110}
            />

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-pretty text-white/75 sm:text-lg">
              {about.themeMeaning}
            </p>
          </div>
        </figure>
      </Reveal>
    </Section>
  );
}

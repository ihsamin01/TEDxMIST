import Reveal from "./Reveal";
import Section from "./Section";
import { about, event } from "@/config/event";

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="01 — About"
      title={`About ${event.name}`}
      intro="An independently organized TEDx event, hosted on the MIST campus in Mirpur Cantonment."
    >
      {/*
        One centred statement rather than a row of panels. The single red dot
        above it is the TEDx shorthand for one idea, and the same mark the hero
        sends its rings out from.
      */}
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span
            aria-hidden
            className="mx-auto block h-2.5 w-2.5 rounded-full bg-ted shadow-[0_0_36px_10px_rgba(235,0,40,0.35)]"
          />

          <p className="mt-9 text-[clamp(1.6rem,5.5vw,2.75rem)] leading-[1.12] font-black tracking-tight text-balance">
            {about.headline}
          </p>

          <span
            aria-hidden
            className="mx-auto mt-9 block h-px w-16 bg-line"
          />

          <p className="mt-9 text-base leading-relaxed text-pretty text-white/70 sm:text-lg">
            {about.ourEvent}
          </p>
        </div>
      </Reveal>

      {/* The theme, given its own weight on the page. */}
      <Reveal delay={160}>
        <figure className="relative mt-20 overflow-hidden rounded-3xl border border-line bg-ink-soft px-6 py-14 text-center sm:px-12 md:mt-28 md:py-20">
          {/* A faint red bloom behind the theme, echoing the hero. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.14),transparent_65%)]"
          />

          <div className="relative">
            <figcaption className="mb-6 text-xs font-bold tracking-[0.25em] text-ted uppercase">
              The theme
            </figcaption>

            <p className="mx-auto max-w-3xl text-[clamp(1.9rem,7vw,3.5rem)] leading-[1.05] font-black tracking-tight text-balance">
              {event.theme}
            </p>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-pretty text-white/75 sm:text-lg">
              {about.themeMeaning}
            </p>
          </div>
        </figure>
      </Reveal>
    </Section>
  );
}

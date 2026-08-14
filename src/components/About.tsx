import Reveal from "./Reveal";
import Section from "./Section";
import { about, event } from "@/config/event";

function Panel({
  heading,
  body,
  delay,
}: {
  heading: string;
  body: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex h-full flex-col items-center rounded-2xl border border-line bg-ink-soft/30 px-6 py-9 text-center transition-colors duration-300 hover:border-ted/40 sm:px-9 sm:py-11">
        <h3 className="mb-5 text-xs font-bold tracking-[0.2em] text-ted uppercase">
          {heading}
        </h3>
        <p className="text-base leading-relaxed text-pretty text-white/75 sm:text-lg">
          {body}
        </p>
      </div>
    </Reveal>
  );
}

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="01 — About"
      title={`About ${event.name}`}
      intro="An independently organized TEDx event, hosted on the MIST campus in Mirpur Cantonment."
    >
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <Panel
          heading="What is a TEDx event?"
          body={about.whatIsTedx}
          delay={0}
        />
        <Panel heading="Our event" body={about.ourEvent} delay={130} />
      </div>

      {/* The theme, given its own weight on the page. */}
      <Reveal delay={220}>
        <figure className="relative mt-16 overflow-hidden rounded-3xl border border-line bg-ink-soft px-6 py-14 text-center sm:px-12 md:mt-24 md:py-20">
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

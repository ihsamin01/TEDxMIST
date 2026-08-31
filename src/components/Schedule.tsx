import Reveal from "./Reveal";
import Section from "./Section";
import { event, schedule } from "@/config/event";

export default function Schedule() {
  return (
    <Section
      id="schedule"
      eyebrow="03 / Schedule"
      title="How the day runs"
      intro={`A provisional running order for ${event.dateLabel}. Exact times will be confirmed nearer the event.`}
    >
      <div className="relative mx-auto max-w-4xl">
        {/*
          The spine. It sits hard left on phones — where a centred spine would
          leave two useless columns — and moves to the middle from md up, where
          there is room for slots to alternate either side of it.
        */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-1.75 w-px bg-line md:left-1/2 md:-translate-x-1/2"
        />

        <ol className="space-y-8 md:space-y-0">
          {schedule.map((slot, i) => {
            const onLeft = i % 2 === 0;

            return (
              <Reveal key={`${slot.time}-${i}`} delay={(i % 3) * 90}>
                <li className="relative pl-9 md:flex md:items-center md:pl-0 md:py-5">
                  {/* Marker on the spine. */}
                  <span
                    className={`absolute top-1.5 left-0 z-10 h-3.5 w-3.5 rounded-full ring-4 ring-ink md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${
                      slot.highlight ? "bg-ted" : "bg-line"
                    }`}
                  />

                  {/* Content, alternating sides on wide screens. */}
                  {/*
                    Slots alternate sides of the spine on wide screens, but the
                    text inside each card stays centred like the rest of the
                    site.
                  */}
                  <div
                    className={`text-center md:w-1/2 ${
                      onLeft ? "md:pr-12" : "md:order-2 md:ml-auto md:pl-12"
                    }`}
                  >
                    <div
                      className={`rounded-2xl border p-5 transition-colors duration-300 sm:p-6 ${
                        slot.highlight
                          ? "border-ted/40 bg-ted/6"
                          : "border-line bg-ink-soft/30 hover:border-line/80"
                      }`}
                    >
                      <time className="text-xs font-black tracking-[0.15em] text-ted tabular-nums">
                        {slot.time}
                      </time>

                      <h3 className="mt-2 text-lg leading-tight font-black tracking-tight text-balance sm:text-xl md:text-2xl">
                        {slot.title}
                      </h3>

                      {slot.detail && (
                        <p className="mt-2.5 text-sm leading-relaxed text-pretty text-muted">
                          {slot.detail}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}

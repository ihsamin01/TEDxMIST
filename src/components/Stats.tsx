"use client";

import Reveal from "./Reveal";
import { useCountUp } from "@/hooks/useScrollUi";
import { event, schedule, speakers } from "@/config/event";

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const { ref, value: shown } = useCountUp(value);

  return (
    <div className="text-center">
      <p className="text-[clamp(2.4rem,9vw,4.5rem)] leading-none font-black tracking-tight text-ted tabular-nums">
        <span ref={ref}>{shown}</span>
        {suffix}
      </p>
      <p className="mt-3 text-[0.6rem] font-bold tracking-[0.2em] text-muted uppercase sm:text-xs">
        {label}
      </p>
    </div>
  );
}

/**
 * The event in four numbers, each counting up the first time it scrolls into
 * view. Every figure is derived from the config, so they can never drift out
 * of step with the rest of the page.
 */
export default function Stats() {
  const sessions = schedule.filter((slot) => slot.highlight).length;

  return (
    <section className="border-t border-line px-5 py-16 sm:px-6 md:py-24">
      <Reveal>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-y-12 sm:grid-cols-4">
          <Stat value={speakers.length} suffix="+" label="Speakers" />
          <Stat value={sessions} label="Sessions" />
          <Stat value={event.seats} label="Seats" />
          <Stat value={1} label="Day" />
        </div>
      </Reveal>
    </section>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import { event } from "@/config/event";

const TARGET = new Date(event.startsAt).getTime();

/**
 * The browser clock is an external system, so the countdown subscribes to it
 * with useSyncExternalStore rather than juggling state in an effect.
 *
 * The snapshot is a whole number of seconds, which means React only re-renders
 * when the displayed value actually changes.
 */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

function getSnapshot(): number | null {
  return Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
}

/**
 * The server has no idea what time it is in the visitor's browser, so it
 * reports null and the skeleton renders instead. React swaps in the real
 * value straight after hydration, so there is never a mismatch.
 */
function getServerSnapshot(): number | null {
  return null;
}

function Unit({
  value,
  label,
  pulse,
}: {
  value: number;
  label: string;
  /** The seconds box gets a subtle tick so the timer reads as live. */
  pulse?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-xl border border-line bg-ink-soft/70 px-1.5 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-ted/50 sm:rounded-2xl sm:px-4 sm:py-6">
      <span
        className={`text-[clamp(1.7rem,7.5vw,4rem)] leading-none font-black tabular-nums ${
          pulse ? "text-ted" : "text-white"
        }`}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-2 text-[0.6rem] font-bold tracking-[0.15em] text-muted uppercase sm:mt-3 sm:text-xs sm:tracking-[0.2em]">
        {label}
      </span>
    </div>
  );
}

type Props = {
  /**
   * Stops the clock and shows zeros. Used when registration has closed, so
   * the hero reads as shut rather than still counting people in.
   */
  frozen?: boolean;
};

export default function Countdown({ frozen = false }: Props) {
  const totalSeconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (frozen) {
    return (
      <div
        className="mx-auto grid w-full max-w-3xl grid-cols-4 gap-1.5 opacity-60 sm:gap-3"
        role="timer"
        aria-label="Registration is closed"
      >
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <Unit key={label} value={0} label={label} />
        ))}
      </div>
    );
  }

  if (totalSeconds === 0) {
    return (
      <p className="text-2xl font-black tracking-tight text-ted md:text-3xl">
        The day is here. See you at {event.venue.short}.
      </p>
    );
  }

  const seconds = totalSeconds ?? 0;

  const parts = [
    { label: "Days", value: Math.floor(seconds / 86400) },
    { label: "Hours", value: Math.floor(seconds / 3600) % 24 },
    { label: "Minutes", value: Math.floor(seconds / 60) % 60 },
    { label: "Seconds", value: seconds % 60, pulse: true },
  ];

  return (
    <div
      className={`mx-auto grid w-full max-w-3xl grid-cols-4 gap-1.5 transition-opacity duration-700 sm:gap-3 ${
        totalSeconds === null ? "opacity-0" : "opacity-100"
      }`}
      role="timer"
      aria-label={`Countdown to ${event.dateLabel}`}
    >
      {parts.map((part) => (
        <Unit
          key={part.label}
          value={part.value}
          label={part.label}
          pulse={part.pulse}
        />
      ))}
    </div>
  );
}

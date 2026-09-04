"use client";

import { useEffect, useRef, useState } from "react";
import { event } from "@/config/event";

/** Any "Reserve your seat" button fires this when sign-ups are shut. */
export const CLOSED_EVENT = "tedxmist:registration-closed";

/**
 * The message that floats up when somebody presses a seat button after
 * registration has closed.
 *
 * Mounted once for the whole page. The buttons announce themselves through a
 * window event rather than being wired to this directly, so a button anywhere
 * on the page can raise it without any of them knowing this exists.
 *
 * Pressing again while it is still up restarts the timer, so it answers every
 * press rather than going quiet after the first one.
 */
export default function ClosedToast() {
  const [shown, setShown] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onClosed = () => {
      setShown(true);

      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(false), 4000);
    };

    window.addEventListener(CLOSED_EVENT, onClosed);

    return () => {
      window.removeEventListener(CLOSED_EVENT, onClosed);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-4 bottom-6 z-[80] flex justify-center transition-all duration-300 sm:bottom-10 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex max-w-md items-start gap-3 rounded-2xl border border-ted/50 bg-ink-soft/95 px-5 py-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)] backdrop-blur-md">
        <span
          aria-hidden
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ted"
        />

        <div>
          <p className="text-sm font-bold tracking-tight">
            Registration is closed
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            We are no longer taking sign-ups for {event.name}. Write to{" "}
            <span className="text-ted">{event.contact.email}</span> to ask about
            the waiting list.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import type { Speaker } from "@/config/event";

type Props = {
  speaker: Speaker | null;
  onClose: () => void;
};

/**
 * The full profile for one speaker.
 *
 * Accessibility work this does, since a dialog that traps people is worse than
 * no dialog at all:
 *   - Escape closes it
 *   - focus moves to the close button on open and returns to the card on close
 *   - Tab cycles inside the dialog instead of escaping to the page behind
 *   - the page behind cannot scroll while it is open
 */
export default function SpeakerModal({ speaker, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** Whatever was focused before we opened, so it can be handed back. */
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!speaker) return;

    returnTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      // Keep Tab inside the panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnTo.current?.focus();
    };
  }, [speaker, onClose]);

  if (!speaker) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="speaker-modal-name"
    >
      {/* Backdrop — clicking it closes, but it is not the only way out. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="relative max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-ink sm:rounded-3xl"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close speaker details"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink/80 text-white backdrop-blur transition hover:border-ted hover:text-ted"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="h-4 w-4"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="flex flex-col items-center px-6 pt-10 pb-10 text-center sm:px-12 sm:pt-14">
          <Avatar
            name={speaker.name}
            photo={speaker.photo}
            className="h-28 w-28 shrink-0 rounded-full ring-1 ring-line sm:h-36 sm:w-36"
          />

          <h3
            id="speaker-modal-name"
            className="mt-6 text-2xl font-black tracking-tight text-balance sm:text-3xl"
          >
            {speaker.name}
          </h3>

          <p className="mt-2 text-sm font-medium text-balance text-muted sm:text-base">
            {speaker.title}
          </p>

          <p className="mt-7 border-y border-line py-5 text-lg leading-snug font-bold text-balance text-ted sm:text-xl">
            {speaker.topic}
          </p>

          <p className="mt-6 max-w-prose text-sm leading-relaxed text-white/75 sm:text-base">
            {speaker.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

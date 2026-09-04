"use client";

import { useState, useTransition } from "react";
import { setRegistrationOpen } from "@/app/admin/actions";

/**
 * Opens and closes sign-ups for the whole site.
 *
 * Closing does not hide anything. The landing page keeps its layout, the
 * countdown freezes at zero, and the seat buttons stay where they are but
 * raise a notice instead of leading anywhere.
 */
export default function RegistrationSwitch({ open }: { open: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const set = (next: boolean) => {
    if (next === open || pending) return;

    startTransition(async () => {
      const result = await setRegistrationOpen(next);
      setError(result.ok ? "" : result.message);
    });
  };

  return (
    <section className="mt-10 rounded-2xl border border-line bg-ink-soft/40 p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2.5 text-sm font-bold tracking-[0.15em] uppercase">
            <span
              aria-hidden
              className={`h-2.5 w-2.5 rounded-full ${
                open ? "bg-ted" : "bg-line"
              }`}
            />
            Registration is {open ? "open" : "closed"}
          </h2>

          <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted">
            {open
              ? "The form is live and taking entries."
              : "The site looks the same, but the countdown sits at zero and the seat buttons answer with a notice instead of opening the form."}
          </p>

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-ted">
              {error}
            </p>
          )}
        </div>

        <div
          role="group"
          aria-label="Registration"
          className="flex shrink-0 gap-2"
        >
          <button
            type="button"
            onClick={() => set(true)}
            disabled={pending || open}
            aria-pressed={open}
            className={`rounded-full px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed ${
              open
                ? "bg-ted text-white"
                : "border border-line text-white hover:border-ted hover:text-ted disabled:opacity-60"
            }`}
          >
            Open
          </button>

          <button
            type="button"
            onClick={() => set(false)}
            disabled={pending || !open}
            aria-pressed={!open}
            className={`rounded-full px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed ${
              !open
                ? "bg-ted text-white"
                : "border border-line text-white hover:border-ted hover:text-ted disabled:opacity-60"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </section>
  );
}

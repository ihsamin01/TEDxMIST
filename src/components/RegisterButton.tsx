"use client";

import Link from "next/link";
import { CLOSED_EVENT } from "./ClosedToast";

type Props = {
  /** Whether sign-ups are open. Read from the database by the page. */
  open: boolean;
  size?: "md" | "lg";
  className?: string;
};

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The button that sends people to the registration form.
 *
 * When registration is closed the button deliberately stays, looking and
 * sitting exactly where it did. Removing it would leave a hole in the layout
 * and leave anyone arriving from a poster wondering whether they had the wrong
 * page. Pressing it raises the floating notice instead, every time, so the
 * answer is the same however many times they try.
 */
export default function RegisterButton({
  open,
  size = "md",
  className = "",
}: Props) {
  const padding =
    size === "lg" ? "px-11 py-5 text-xl" : "px-7 py-3.5 text-base";
  const base = `inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-tight transition ${padding} ${className}`;
  const look =
    "bg-ted text-white hover:-translate-y-0.5 hover:bg-ted-dark hover:shadow-[0_10px_30px_-8px_rgba(235,0,40,0.6)]";

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(CLOSED_EVENT))}
        aria-label="Registration is closed"
        className={`${base} border border-line bg-line/60 text-muted hover:border-ted/50 hover:text-white`}
      >
        Registration closed
      </button>
    );
  }

  return (
    <Link href="/register" className={`${base} ${look}`}>
      Reserve your seat
      <Arrow />
    </Link>
  );
}

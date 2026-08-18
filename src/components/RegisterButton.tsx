import Link from "next/link";
import { registration } from "@/config/event";

type Props = {
  size?: "md" | "lg";
  className?: string;
};

/**
 * The one button that sends people to the registration form at /register.
 *
 * When `registration.isOpen` is false in config/event.ts it renders disabled
 * instead, so closing sign-ups is a one-line change.
 */
export default function RegisterButton({ size = "md", className = "" }: Props) {
  const padding = size === "lg" ? "px-10 py-5 text-lg" : "px-7 py-3.5 text-base";
  const base = `inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-tight transition ${padding} ${className}`;

  if (!registration.isOpen) {
    return (
      <span className={`${base} cursor-not-allowed bg-line text-muted`}>
        Registration closed
      </span>
    );
  }

  return (
    <Link
      href="/register"
      className={`${base} bg-ted text-white hover:-translate-y-0.5 hover:bg-ted-dark hover:shadow-[0_10px_30px_-8px_rgba(235,0,40,0.6)]`}
    >
      Reserve your seat
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
    </Link>
  );
}

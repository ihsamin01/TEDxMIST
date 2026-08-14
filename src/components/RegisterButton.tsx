import { registration } from "@/config/event";

type Props = {
  size?: "md" | "lg";
  className?: string;
};

/**
 * The one button that sends people to the external registration form.
 *
 * It has three states, all driven from config/event.ts, so the site is safe to
 * publish before the form is ready:
 *   - registration closed        -> disabled, "Registration closed"
 *   - open but no URL set yet    -> disabled, "Registration opening soon"
 *   - open with a URL            -> live link, opens in a new tab
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

  if (!registration.formUrl) {
    return (
      <span className={`${base} cursor-not-allowed bg-line text-muted`}>
        Registration opening soon
      </span>
    );
  }

  return (
    <a
      href={registration.formUrl}
      target="_blank"
      rel="noopener noreferrer"
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
    </a>
  );
}

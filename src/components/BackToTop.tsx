"use client";

import { useEffect, useRef } from "react";

/**
 * A floating button back to the top, revealed once the visitor is well past
 * the hero. Hidden from assistive tech while invisible so it cannot be tabbed
 * to by accident.
 */
export default function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const shown = window.scrollY > window.innerHeight * 1.2;
      el.style.opacity = shown ? "1" : "0";
      el.style.transform = shown ? "translateY(0)" : "translateY(12px)";
      el.style.pointerEvents = shown ? "auto" : "none";
      el.setAttribute("aria-hidden", shown ? "false" : "true");
      el.tabIndex = shown ? 0 : -1;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink-soft/90 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-ted hover:text-ted sm:right-6 sm:bottom-6"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * A quiet nudge at the bottom of the hero telling people there is more below.
 * It fades itself out as soon as they take the hint.
 */
export default function ScrollCue() {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      // Gone by the time a third of the first screen has passed.
      const faded = window.scrollY > window.innerHeight * 0.3;
      el.style.opacity = faded ? "0" : "1";
      el.style.pointerEvents = faded ? "none" : "auto";
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      ref={ref}
      href="#about"
      aria-label="Scroll to the next section"
      className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 md:flex"
    >
      <span className="text-[0.6rem] font-bold tracking-[0.2em] text-muted uppercase">
        Scroll
      </span>
      {/* A dot falling down a tube, on a loop. */}
      <span className="flex h-9 w-5 justify-center rounded-full border border-line pt-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ted" />
      </span>
    </a>
  );
}

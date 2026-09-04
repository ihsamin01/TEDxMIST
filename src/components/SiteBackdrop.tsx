"use client";

import { useEffect, useRef } from "react";

/**
 * The backdrop for the whole site: a red dot with rings travelling outward
 * from it, pinned to the viewport rather than to the page.
 *
 * Because it is fixed, it does not scroll away. Every section is read against
 * the same slowly breathing field, which is what stops the page below the
 * hero from feeling like a different, flatter website.
 *
 * Sizing is deliberately not the same on a phone as on a desktop. The rings
 * are drawn as a circle centred on the viewport, so the part you actually see
 * is the arc crossing the screen. Make that circle much wider than the screen
 * and the only visible arc sits hard against the edges, which is exactly where
 * the vignette has already faded it to black: the effect disappears. On narrow
 * screens the field is therefore smaller, so the rings sweep through the middle
 * where they can be seen, and the vignette is gentler to match.
 */
export default function SiteBackdrop() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    // Motion here is decoration, so anyone who asked for less of it gets none.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const canHover = window.matchMedia("(hover: hover)").matches;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      // Ease towards the target rather than snapping to it.
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      field.style.transform = `translate(-50%, -50%) translate3d(${currentX}px, ${currentY}px, 0)`;

      frame =
        Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1
          ? requestAnimationFrame(render)
          : 0;
    };

    const queue = () => {
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    /** Desktop: the field leans towards the pointer. */
    const onPointerMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 56;
      targetY = (e.clientY / window.innerHeight - 0.5) * 56;
      queue();
    };

    /**
     * Touch: there is no pointer to follow, so the field answers to scrolling
     * instead. Without this the backdrop is the one part of the site that
     * never reacts to anything on a phone.
     */
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;

      // A slow drift across the page, never more than a nudge.
      targetY = (progress - 0.5) * -70;
      targetX = Math.sin(progress * Math.PI * 2) * 26;
      queue();
    };

    if (canHover) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    } else {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Six rings, evenly offset across the loop so one is always mid-flight.
  const rings = [0, 1.5, 3, 4.5, 6, 7.5];

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div
        ref={fieldRef}
        className="absolute top-1/2 left-1/2 h-[min(115vmin,460px)] w-[min(115vmin,460px)] -translate-x-1/2 -translate-y-1/2 will-change-transform md:h-[min(150vmin,1040px)] md:w-[min(150vmin,1040px)]"
      >
        {rings.map((delay) => (
          <span
            key={delay}
            className="echo-ring absolute inset-0 rounded-full border border-ted"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        {/* The idea itself, sitting at the centre of every ring. */}
        <span className="pulse-dot absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-ted shadow-[0_0_70px_20px_rgba(235,0,40,0.3)]" />
      </div>

      {/*
        Keeps the rings off the edges so text never has to fight them. Gentler
        on phones, where the screen is narrow enough that a hard vignette would
        swallow the rings entirely.
      */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,var(--color-ink)_92%)] md:bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-ink)_72%)]" />
    </div>
  );
}

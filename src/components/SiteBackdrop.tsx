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
 * The single dot is the TEDx shorthand for one idea, and the rings leaving it
 * are the event's theme drawn literally. The whole cluster drifts a little
 * towards the pointer, written straight to the DOM inside a rAF callback so
 * moving the mouse never causes a React render.
 */
export default function SiteBackdrop() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    // Pointer drift is decoration. Skip it for anyone who asked for less
    // motion, and on touch screens where there is no pointer to follow.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (reduced || !canHover) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      // Ease towards the pointer rather than snapping to it.
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      field.style.transform = `translate(-50%, -50%) translate3d(${currentX}px, ${currentY}px, 0)`;

      frame =
        Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1
          ? requestAnimationFrame(render)
          : 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      // -1 .. 1 across the viewport, scaled down to a gentle amount of travel.
      targetX = (e.clientX / window.innerWidth - 0.5) * 56;
      targetY = (e.clientY / window.innerHeight - 0.5) * 56;
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
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
        className="absolute top-1/2 left-1/2 h-[min(175vw,1080px)] w-[min(175vw,1080px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
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

      {/* Keeps the rings off the edges, so text never has to fight them. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-ink)_72%)]" />
    </div>
  );
}

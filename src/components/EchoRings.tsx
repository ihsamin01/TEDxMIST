"use client";

import { useEffect, useRef } from "react";

/**
 * Decorative hero backdrop: a red dot with rings travelling outwards from it.
 *
 * The single red dot is the TEDx visual shorthand for one idea; the rings are
 * the theme. The whole cluster drifts a little towards the pointer, which
 * makes the hero feel alive without anything actually moving on its own.
 *
 * The drift is written directly to the DOM node inside a rAF callback, so
 * moving the mouse never causes a React re-render.
 */
export default function EchoRings() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    // A pointer-driven effect is pure decoration; skip it entirely for anyone
    // who has asked for reduced motion, and on touch devices where there is
    // no hover to respond to.
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
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      field.style.transform = `translate(-50%, -50%) translate3d(${currentX}px, ${currentY}px, 0)`;

      // Keep animating only while there is still meaningful distance to close.
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        frame = requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // -1 .. 1 across the viewport, scaled down to a gentle 26px of travel.
      targetX = (e.clientX / window.innerWidth - 0.5) * 52;
      targetY = (e.clientY / window.innerHeight - 0.5) * 52;
      if (frame === 0) frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Five rings, evenly offset across the 9s loop so one is always mid-flight.
  const rings = [0, 1.8, 3.6, 5.4, 7.2];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <div
        ref={fieldRef}
        className="absolute top-1/2 left-1/2 h-[min(170vw,1000px)] w-[min(170vw,1000px)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        {rings.map((delay) => (
          <span
            key={delay}
            className="echo-ring absolute inset-0 rounded-full border border-ted"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}

        {/* The idea itself, sitting at the centre of every ring. */}
        <span className="pulse-dot absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-ted shadow-[0_0_70px_20px_rgba(235,0,40,0.35)]" />
      </div>

      {/* Fades the rings out towards the edges so they never fight the text. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,var(--color-ink)_70%)]" />
    </div>
  );
}

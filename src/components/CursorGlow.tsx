"use client";

import { useEffect, useRef } from "react";

/**
 * A soft red light that trails the pointer across whatever it is dropped into.
 *
 * Position is written straight to the node inside a rAF callback, so moving
 * the mouse never causes a React render. Skipped entirely on touch screens,
 * where there is no pointer to follow, and for anyone who asked for less
 * motion.
 */
export default function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = glow.current;
    const section = node?.parentElement;
    if (!node || !section) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (reduced || !canHover) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let started = false;

    const render = () => {
      // Trail behind the cursor rather than stick to it.
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;

      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      frame =
        Math.abs(targetX - x) > 0.4 || Math.abs(targetY - y) > 0.4
          ? requestAnimationFrame(render)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      const box = section.getBoundingClientRect();
      targetX = e.clientX - box.left;
      targetY = e.clientY - box.top;

      // Put it under the cursor on the first move, instead of flying in.
      if (!started) {
        started = true;
        x = targetX;
        y = targetY;
        node.style.opacity = "1";
      }

      if (frame === 0) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      node.style.opacity = "0";
      started = false;
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);

    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={glow}
      aria-hidden
      className="cursor-glow pointer-events-none absolute top-0 left-0 h-[420px] w-[420px] rounded-full opacity-0 bg-[radial-gradient(circle,rgba(235,0,40,0.16),transparent_65%)]"
    />
  );
}

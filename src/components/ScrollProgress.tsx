"use client";

import { useScrollProgress } from "@/hooks/useScrollUi";

/**
 * A hairline red bar across the very top of the window showing how far through
 * the page you are. Sits above the nav.
 */
export default function ScrollProgress() {
  const barRef = useScrollProgress();

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-ted"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

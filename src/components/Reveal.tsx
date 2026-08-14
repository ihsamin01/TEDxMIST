"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger in milliseconds, so items in a grid animate one after another. */
  delay?: number;
};

/**
 * Fades and lifts its children into view the first time they are scrolled to.
 * The animation itself lives in globals.css under [data-reveal]; this component
 * only decides *when* to add the `is-visible` class.
 */
export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Once it has appeared, keep it visible and stop watching.
        window.setTimeout(() => el.classList.add("is-visible"), delay);
        observer.unobserve(el);
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}

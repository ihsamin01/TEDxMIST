"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  className?: string;
  /** Gap between one word and the next, in milliseconds. */
  stagger?: number;
  /** Wait this long after the line appears before starting. */
  delay?: number;
};

/**
 * Lifts a line into place one word at a time, the first time it is scrolled to.
 *
 * Each word is its own inline-block with an animation-delay, and the animation
 * only runs once the wrapper picks up `is-visible`. The words are real text in
 * the markup, so this reads normally to search engines and screen readers.
 */
export default function WordReveal({
  text,
  className = "",
  stagger = 70,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-visible");
        observer.unobserve(el);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <p ref={ref} data-words className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          style={{ animationDelay: `${delay + i * stagger}ms` }}
        >
          {word}
          {/* A real space, so the line still wraps and copies normally. */}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

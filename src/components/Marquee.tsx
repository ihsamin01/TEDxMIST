import { marqueeWords } from "@/config/event";

/**
 * A slow ticker of theme words running between sections. It gives the page a
 * moment of movement without asking anything of the visitor, and hovering
 * pauses it so a word can actually be read.
 *
 * The track holds the list twice and slides exactly half its width, which is
 * what makes the loop seamless.
 */
export default function Marquee() {
  const run = [...marqueeWords, ...marqueeWords];

  return (
    <div
      aria-hidden
      className="marquee overflow-hidden border-y border-line bg-ink-soft/40 py-5 select-none sm:py-7"
    >
      <div className="marquee-track flex w-max items-center gap-8 sm:gap-12">
        {run.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-8 sm:gap-12">
            <span className="text-lg font-black tracking-tight whitespace-nowrap text-white/25 sm:text-2xl md:text-3xl">
              {word}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ted" />
          </span>
        ))}
      </div>
    </div>
  );
}

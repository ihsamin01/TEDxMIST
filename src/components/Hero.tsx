import Countdown from "./Countdown";
import RegisterButton from "./RegisterButton";
import ScrollCue from "./ScrollCue";
import { event, registration } from "@/config/event";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 text-center">
      <p className="mb-1.5 text-[0.55rem] font-bold tracking-[0.2em] text-ted uppercase sm:text-[0.65rem]">
        {label}
      </p>
      <p className="text-xs leading-snug font-semibold text-balance text-white/90 sm:text-sm md:text-base">
        {value}
      </p>
    </div>
  );
}

export default function Hero({ open }: { open: boolean }) {
  const suffix = event.name.replace(/^TEDx/, "");

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pt-28 pb-24 sm:px-6">
      <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
        {/* Theme */}
        <p
          className="rise-in mb-5 rounded-full border border-ted/40 px-4 py-1.5 text-[0.6rem] font-bold tracking-[0.25em] text-ted uppercase sm:mb-7 sm:text-xs sm:tracking-[0.3em]"
          style={{ animationDelay: "0.1s" }}
        >
          {event.theme}
        </p>

        {/*
          One line, always. Two stacked lines read as a broken wordmark on a
          narrow screen, and the mark is the one thing on the page that has to
          look deliberate. The size is chosen so all eight characters fit
          across the smallest phone without wrapping.
        */}
        <h1
          className="rise-in leading-[0.9] font-black tracking-tighter whitespace-nowrap"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="text-[clamp(2.2rem,13.5vw,8.5rem)] text-ted">
            TEDx
          </span>
          <span className="text-outline text-[clamp(2.2rem,13.5vw,8.5rem)]">
            {suffix}
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="rise-in mt-7 max-w-lg text-base leading-snug font-medium text-balance text-white/80 sm:mt-9 sm:text-xl md:text-2xl"
          style={{ animationDelay: "0.44s" }}
        >
          {event.tagline}
        </p>

        {/* Date / time / venue */}
        <div
          className="rise-in mt-10 grid w-full max-w-2xl grid-cols-2 gap-y-6 border-y border-line py-6 sm:mt-12 sm:grid-cols-3 sm:divide-x sm:divide-line sm:py-7"
          style={{ animationDelay: "0.54s" }}
        >
          <Meta label="Date" value={event.dateLabel} />
          <Meta label="Time" value={event.timeLabel} />
          <Meta label="Venue" value={event.venue.short} />
        </div>

        {/* Countdown */}
        <div
          className="rise-in mt-10 w-full sm:mt-12"
          style={{ animationDelay: "0.64s" }}
        >
          <p
            className={`mb-4 text-[0.55rem] font-bold tracking-[0.2em] uppercase sm:text-[0.65rem] ${
              open ? "text-muted" : "text-ted"
            }`}
          >
            {open ? "Counting down to the stage" : "Registration closed"}
          </p>
          <Countdown frozen={!open} />
        </div>

        {/* Call to action */}
        <div
          className="rise-in mt-10 flex flex-col items-center gap-4 sm:mt-12"
          style={{ animationDelay: "0.74s" }}
        >
          <RegisterButton open={open} size="lg" />
          <p className="max-w-xs text-xs leading-snug text-balance text-muted sm:text-sm">
            {registration.note}
          </p>
        </div>
      </div>

      <ScrollCue />


    </section>
  );
}

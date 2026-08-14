import Countdown from "./Countdown";
import EchoRings from "./EchoRings";
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

export default function Hero() {
  const suffix = event.name.replace(/^TEDx/, "");

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-24 sm:px-6">
      <EchoRings />

      <div className="relative flex w-full max-w-4xl flex-col items-center text-center">
        {/* Theme */}
        <p
          className="rise-in mb-5 rounded-full border border-ted/40 px-4 py-1.5 text-[0.6rem] font-bold tracking-[0.25em] text-ted uppercase sm:mb-7 sm:text-xs sm:tracking-[0.3em]"
          style={{ animationDelay: "0.1s" }}
        >
          {event.theme}
        </p>

        {/* Event name — "TEDx" solid, the campus name outlined underneath. */}
        <h1 className="leading-[0.82] font-black tracking-tighter">
          <span
            className="rise-in block text-[clamp(3.4rem,17vw,10rem)] text-ted"
            style={{ animationDelay: "0.2s" }}
          >
            TEDx
          </span>
          <span
            className="rise-in text-outline block text-[clamp(3.4rem,17vw,10rem)]"
            style={{ animationDelay: "0.32s" }}
          >
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

        {/* Date / venue / seats */}
        <div
          className="rise-in mt-10 grid w-full max-w-2xl grid-cols-2 gap-y-6 border-y border-line py-6 sm:mt-12 sm:grid-cols-4 sm:divide-x sm:divide-line sm:py-7"
          style={{ animationDelay: "0.54s" }}
        >
          <Meta label="Date" value={event.dateLabel} />
          <Meta label="Time" value={event.timeLabel} />
          <Meta label="Venue" value={event.venue.short} />
          <Meta label="Seats" value={`${event.seats} only`} />
        </div>

        {/* Countdown */}
        <div
          className="rise-in mt-10 w-full sm:mt-12"
          style={{ animationDelay: "0.64s" }}
        >
          <p className="mb-4 text-[0.55rem] font-bold tracking-[0.2em] text-muted uppercase sm:text-[0.65rem]">
            Counting down to the stage
          </p>
          <Countdown />
        </div>

        {/* Call to action */}
        <div
          className="rise-in mt-10 flex flex-col items-center gap-4 sm:mt-12"
          style={{ animationDelay: "0.74s" }}
        >
          <RegisterButton size="lg" />
          <p className="max-w-xs text-xs leading-snug text-balance text-muted sm:text-sm">
            {registration.note}
          </p>
        </div>
      </div>

      <ScrollCue />

      {/* The line TED requires everywhere the brand appears. */}
      <p className="absolute inset-x-0 bottom-4 px-5 text-center text-[0.6rem] tracking-wide text-muted sm:text-[0.65rem]">
        x = independently organized TED event
      </p>
    </section>
  );
}

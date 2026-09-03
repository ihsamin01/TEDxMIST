import RegisterButton from "./RegisterButton";
import Reveal from "./Reveal";
import { registration } from "@/config/event";

export default function Register() {
  return (
    <section
      id="register"
      className="relative scroll-mt-24 overflow-hidden border-t border-line px-5 py-24 sm:px-6 md:py-36"
    >
      {/* A single red wash, echoing the hero without repeating it. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(235,0,40,0.22),transparent_62%)]"
      />

      <Reveal className="relative mx-auto max-w-3xl text-center">
        <p className="mb-5 text-[0.65rem] font-bold tracking-[0.25em] text-ted uppercase sm:text-xs">
          Attend
        </p>

        <h2 className="text-[clamp(2rem,7.5vw,3.75rem)] leading-[1.05] font-black tracking-tight text-balance">
          One day. One room. One stage.
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-pretty text-white/75 sm:text-lg">
          Attendance is kept deliberately small, so the room stays intimate
          enough that you can actually talk to the speakers afterwards. Come
          and hear what tomorrow already sounds like.
        </p>

        <div className="mt-10 flex justify-center">
          <RegisterButton size="lg" />
        </div>

        <p className="mt-6 text-xs text-balance text-muted sm:text-sm">
          {registration.note}
        </p>
      </Reveal>
    </section>
  );
}

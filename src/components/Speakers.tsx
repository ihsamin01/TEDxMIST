"use client";

import { useState } from "react";
import Avatar from "./Avatar";
import Reveal from "./Reveal";
import Section from "./Section";
import SpeakerModal from "./SpeakerModal";
import { speakers, type Speaker } from "@/config/event";

export default function Speakers() {
  const [selected, setSelected] = useState<Speaker | null>(null);

  return (
    <>
      <Section
        id="speakers"
        eyebrow="02 / Speakers"
        title="The people on stage"
        intro="Engineers, researchers, artists and founders, each given the same brief: tell us what you are sending forward."
      >
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {speakers.map((speaker, i) => (
            <Reveal key={`${speaker.name}-${i}`} delay={(i % 3) * 110}>
              <button
                type="button"
                onClick={() => setSelected(speaker)}
                aria-label={`Read more about ${speaker.name}`}
                className="group flex h-full w-full flex-col items-center rounded-2xl border border-line bg-ink-soft/40 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-ted/60 hover:bg-ink-soft hover:shadow-[0_18px_40px_-20px_rgba(235,0,40,0.5)] sm:p-8"
              >
                <Avatar
                  name={speaker.name}
                  photo={speaker.photo}
                  className="h-24 w-24 shrink-0 rounded-full ring-1 ring-line transition-shadow duration-300 group-hover:ring-ted sm:h-28 sm:w-28"
                />

                <h3 className="mt-5 text-lg font-black tracking-tight text-balance sm:text-xl">
                  {speaker.name}
                </h3>

                <p className="mt-1.5 text-xs font-medium text-balance text-muted sm:text-sm">
                  {speaker.title}
                </p>

                <p className="mt-5 flex-1 text-sm leading-snug font-bold text-balance text-white/90">
                  {speaker.topic}
                </p>

                {/* Affordance: makes it obvious the card does something. */}
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.15em] text-ted uppercase transition-opacity duration-300 sm:opacity-60 sm:group-hover:opacity-100">
                  Read bio
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-12 text-center text-sm text-muted">
            More speakers are still being confirmed. Check back closer to the
            event.
          </p>
        </Reveal>
      </Section>

      <SpeakerModal speaker={selected} onClose={() => setSelected(null)} />
    </>
  );
}

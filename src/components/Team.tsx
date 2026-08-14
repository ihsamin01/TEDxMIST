import Avatar from "./Avatar";
import Reveal from "./Reveal";
import Section from "./Section";
import { event, team } from "@/config/event";

export default function Team() {
  return (
    <Section
      id="team"
      eyebrow="04 — Team"
      title="The organizing team"
      intro={`${event.name} is put together by students of ${event.venue.name}, under licence from TED.`}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
        {team.map((member, i) => (
          <Reveal key={`${member.name}-${i}`} delay={(i % 4) * 90}>
            <figure className="group flex flex-col items-center text-center">
              <div className="relative">
                <Avatar
                  name={member.name}
                  photo={member.photo}
                  className="aspect-square w-full max-w-37.5 rounded-full ring-1 ring-line transition-shadow duration-300 group-hover:ring-ted sm:max-w-42.5"
                />
                {/* A red halo that blooms on hover. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_40px_-4px_rgba(235,0,40,0.5)]"
                />
              </div>

              <figcaption className="mt-4 sm:mt-5">
                <p className="text-sm leading-tight font-bold tracking-tight text-balance sm:text-base">
                  {member.name}
                </p>
                <p className="mt-1.5 text-xs text-muted sm:text-sm">
                  {member.role}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

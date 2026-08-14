"use client";

import { useEffect, useState } from "react";
import RegisterButton from "./RegisterButton";
import { navLinks } from "@/config/event";
import { useActiveSection } from "@/hooks/useScrollUi";

/** Section ids the nav tracks, derived from the links themselves. */
const SECTION_IDS = navLinks.map((link) => link.href.slice(1));

export default function Nav() {
  /** Transparent over the hero, solid once you start scrolling. */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stop the page scrolling behind the open mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the drawer if the viewport grows to desktop while it is open.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-line bg-ink/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 md:h-20">
        <a
          href="#top"
          className="text-xl font-black tracking-tight whitespace-nowrap md:text-2xl"
          aria-label="Back to top"
        >
          <span className="text-ted">TEDx</span>
          <span className="text-white">MIST</span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1);

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 text-sm font-semibold transition-colors ${
                  isActive ? "text-ted" : "text-white/75 hover:text-ted"
                }`}
              >
                {link.label}
                {/* Underline that grows in on the section you are reading. */}
                <span
                  aria-hidden
                  className={`absolute -bottom-0.5 left-0 h-0.5 origin-left bg-ted transition-transform duration-300 ${
                    isActive ? "w-full scale-x-100" : "w-full scale-x-0"
                  }`}
                />
              </a>
            );
          })}
          <RegisterButton />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-6 bg-white transition-all duration-300 ${
                menuOpen ? "top-1/2 -rotate-45" : "top-full"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-line bg-ink transition-[max-height] duration-300 md:hidden ${
          menuOpen ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-1 px-5 py-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`py-3 text-lg font-bold tracking-tight transition-colors ${
                active === link.href.slice(1)
                  ? "text-ted"
                  : "text-white hover:text-ted"
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 w-full max-w-xs">
            <RegisterButton className="w-full" />
          </div>
        </div>
      </div>
    </header>
  );
}

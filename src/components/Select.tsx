"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Dropdown. A native <select> would be less code, but phones draw its option
 * list themselves, so on Android it opens white on our black page and CSS
 * can't reach it.
 *
 * The value sits in a hidden input, so forms behave as with a real <select>.
 */

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  /** Shown when nothing is chosen yet. */
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  id?: string;
};

export default function Select({
  name,
  value,
  onChange,
  options,
  placeholder = "Select one",
  invalid,
  describedBy,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  /** Highlighted option. */
  const [active, setActive] = useState(0);

  const wrapper = useRef<HTMLDivElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listId = `${buttonId}-list`;

  // Close on a tap outside.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted row in view.
  useEffect(() => {
    if (!open) return;
    listbox.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  /** Open with the current value highlighted. */
  const openList = () => {
    const index = options.indexOf(value);
    setActive(index < 0 ? 0 : index);
    setOpen(true);
  };

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openList();
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((current) => {
          const next = current + step;
          if (next < 0) return options.length - 1;
          if (next >= options.length) return 0;
          return next;
        });
        return;
      }
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(options[active]);
        else openList();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(options.length - 1);
        }
    }
  };

  return (
    <div ref={wrapper} className="relative">
      {/* What gets submitted. */}
      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={buttonId}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-describedby={describedBy}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[0.95rem] transition outline-none focus-visible:border-ted focus-visible:ring-2 focus-visible:ring-ted/30 ${
          invalid ? "border-ted" : "border-line hover:border-white/25"
        } ${open ? "border-ted bg-ink-soft" : "bg-ink-soft"} ${
          value ? "text-white" : "text-muted/60"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>

        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
            open ? "-rotate-180" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listbox}
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto overscroll-contain rounded-xl border border-line bg-ink-soft py-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)]"
        >
          {options.map((option, index) => {
            const selected = option === value;

            return (
              <li
                key={option}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(option)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-[0.95rem] transition-colors ${
                  index === active ? "bg-white/[0.07]" : ""
                } ${selected ? "font-semibold text-ted" : "text-white/85"}`}
              >
                {option}

                {selected && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 shrink-0"
                  >
                    <path d="m4 12 6 6L20 6" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

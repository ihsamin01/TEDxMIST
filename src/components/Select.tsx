"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * Dropdown. A native <select> would be less code, but phones draw its option
 * list themselves, so on Android it opens white on our black page and CSS
 * can't reach it.
 *
 * The value sits in a hidden input, so forms behave as with a real <select>.
 *
 * `searchable` adds a filter box, which is what makes a seventy-item list of
 * universities usable on a phone.
 */

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  /** Adds a filter box at the top of the list. */
  searchable?: boolean;
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
  searchable = false,
  placeholder = "Select one",
  invalid,
  describedBy,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  /** Highlighted option, as an index into the filtered list. */
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");

  const wrapper = useRef<HTMLDivElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listId = `${buttonId}-list`;

  /** What the arrow keys walk through, once the filter has been applied. */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.toLowerCase().includes(q));
  }, [options, query]);

  /** Shut the list and drop the filter, without moving focus. */
  const dismiss = () => {
    setOpen(false);
    setQuery("");
  };

  // Close on a tap outside.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) dismiss();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Put the cursor straight in the filter box, so you can just start typing.
  useEffect(() => {
    if (open && searchable) search.current?.focus();
  }, [open, searchable]);

  /**
   * Typing a filter shortens the list, which can leave `active` pointing past
   * the end. Clamping here rather than in an effect keeps it a plain derived
   * value, so there is no second render to correct itself.
   */
  const activeIndex = active < visible.length ? active : 0;

  // Keep the highlighted row in view.
  useEffect(() => {
    if (!open) return;
    listbox.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  /** Open with the current value highlighted. */
  const openList = () => {
    const index = options.indexOf(value);
    setQuery("");
    setActive(index < 0 ? 0 : index);
    setOpen(true);
  };

  const close = () => {
    dismiss();
    button.current?.focus();
  };

  const choose = (option: string) => {
    onChange(option);
    dismiss();
    button.current?.focus();
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
        if (visible.length === 0) return;

        const step = event.key === "ArrowDown" ? 1 : -1;
        let next = activeIndex + step;
        if (next < 0) next = visible.length - 1;
        if (next >= visible.length) next = 0;
        setActive(next);
        return;
      }
      case "Enter":
        event.preventDefault();
        if (open) {
          if (visible[activeIndex]) choose(visible[activeIndex]);
        } else {
          openList();
        }
        return;
      case " ":
        // While typing a filter, a space is just a space.
        if (open && searchable) return;
        event.preventDefault();
        if (open) {
          if (visible[activeIndex]) choose(visible[activeIndex]);
        } else {
          openList();
        }
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          close();
        }
        return;
      case "Tab":
        dismiss();
        return;
      case "Home":
        if (open && !searchable) {
          event.preventDefault();
          setActive(0);
        }
        return;
      case "End":
        if (open && !searchable) {
          event.preventDefault();
          setActive(visible.length - 1);
        }
    }
  };

  return (
    <div ref={wrapper} className="relative">
      {/* What gets submitted. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={button}
        type="button"
        id={buttonId}
        onClick={() => (open ? dismiss() : openList())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-describedby={describedBy}
        className={`flex w-full items-center justify-between gap-3 overflow-hidden rounded-xl border px-4 py-3 text-left text-[0.95rem] transition outline-none focus-visible:border-ted focus-visible:ring-2 focus-visible:ring-ted/30 ${
          invalid ? "border-ted" : "border-line hover:border-white/25"
        } ${open ? "border-ted bg-ink-soft" : "bg-ink-soft"} ${
          value ? "text-white" : "text-muted/60"
        }`}
      >
        {/*
          min-w-0 matters: a flex item will not shrink below its content
          width without it, so a long university name pushed the button wider
          than the page and took the whole layout sideways with it.
        */}
        <span className="min-w-0 truncate">{value || placeholder}</span>

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
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-ink-soft shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)]">
          {searchable && (
            <div className="border-b border-line p-2">
              <input
                ref={search}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Filter the list"
                aria-controls={listId}
                aria-activedescendant={
                  visible[activeIndex] ? `${listId}-${activeIndex}` : undefined
                }
                className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-[0.9rem] text-white outline-none focus:border-ted"
              />
            </div>
          )}

          <ul
            ref={listbox}
            id={listId}
            role="listbox"
            aria-labelledby={buttonId}
            tabIndex={-1}
            onKeyDown={onKeyDown}
            className="max-h-60 overflow-y-auto overscroll-contain py-1.5"
          >
            {visible.length === 0 && (
              <li className="px-4 py-3 text-[0.9rem] text-muted">
                Nothing matches. Choose “Other” to type your own.
              </li>
            )}

            {visible.map((option, index) => {
              const selected = option === value;

              return (
                <li
                  key={option}
                  id={`${listId}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-[0.95rem] transition-colors ${
                    index === activeIndex ? "bg-white/[0.07]" : ""
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
        </div>
      )}
    </div>
  );
}

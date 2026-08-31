"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

/**
 * Dropdown. A native <select> would be less code, but phones draw its option
 * list themselves, so on Android it opens white on our black page and CSS
 * can't reach it.
 *
 * The value sits in a hidden input, so forms behave as with a real <select>.
 *
 * Pass `options` for a plain list, or `groups` for a list with headings.
 * `searchable` adds a filter box, which is what makes a fifty-item list of
 * universities usable on a phone.
 */

type Group = { label: string; options: readonly string[] };

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  /** A flat list. Ignored when `groups` is given. */
  options?: readonly string[];
  /** A list with headings. */
  groups?: readonly Group[];
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
  groups,
  searchable = false,
  placeholder = "Select one",
  invalid,
  describedBy,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  /** Highlighted option, as an index into the filtered flat list. */
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");

  const wrapper = useRef<HTMLDivElement>(null);
  const listbox = useRef<HTMLUListElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const generatedId = useId();
  const buttonId = id ?? generatedId;
  const listId = `${buttonId}-list`;

  /** One shape for both APIs: an unnamed group behaves like a flat list. */
  const sourceGroups: readonly Group[] = useMemo(
    () => groups ?? [{ label: "", options: options ?? [] }],
    [groups, options],
  );

  /** Groups with the filter applied, and empty ones dropped. */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sourceGroups;

    return sourceGroups
      .map((group) => ({
        label: group.label,
        options: group.options.filter((option) =>
          option.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [sourceGroups, query]);

  /** What the arrow keys walk through. */
  const flat = useMemo(
    () => visible.flatMap((group) => group.options),
    [visible],
  );

  /**
   * The same groups, with every option carrying its position in `flat`, so the
   * arrow keys and the rendered rows agree on what "row 12" means. Numbering
   * them here keeps the render itself free of a running counter.
   */
  const numbered = useMemo(() => {
    let next = 0;
    return visible.map((group) => ({
      label: group.label,
      options: group.options.map((value) => ({ value, index: next++ })),
    }));
  }, [visible]);

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
  const activeIndex = active < flat.length ? active : 0;

  // Keep the highlighted row in view.
  useEffect(() => {
    if (!open) return;
    listbox.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  /** Open with the current value highlighted. */
  const openList = () => {
    const index = sourceGroups.flatMap((group) => group.options).indexOf(value);
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
        if (flat.length === 0) return;

        const step = event.key === "ArrowDown" ? 1 : -1;
        let next = activeIndex + step;
        if (next < 0) next = flat.length - 1;
        if (next >= flat.length) next = 0;
        setActive(next);
        return;
      }
      case "Enter":
        event.preventDefault();
        if (open) {
          if (flat[activeIndex]) choose(flat[activeIndex]);
        } else {
          openList();
        }
        return;
      case " ":
        // While typing a filter, a space is just a space.
        if (open && searchable) return;
        event.preventDefault();
        if (open) {
          if (flat[activeIndex]) choose(flat[activeIndex]);
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
          setActive(flat.length - 1);
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
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-line bg-ink-soft shadow-[0_20px_50px_-12px_rgba(0,0,0,0.9)]">
          {searchable && (
            <div className="border-b border-line p-2">
              <input
                ref={search}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type to search…"
                aria-label="Filter the list"
                aria-controls={listId}
                aria-activedescendant={
                  flat[activeIndex] ? `${listId}-${activeIndex}` : undefined
                }
                className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-[0.9rem] text-white outline-none placeholder:text-muted/60 focus:border-ted"
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
            {flat.length === 0 && (
              <li className="px-4 py-3 text-[0.9rem] text-muted">
                Nothing matches that. Choose “Other” to type your own.
              </li>
            )}

            {numbered.map((group) => (
              <li key={group.label || "all"}>
                {group.label && (
                  <p className="px-4 pt-2.5 pb-1 text-[0.65rem] font-bold tracking-[0.15em] text-muted uppercase">
                    {group.label}
                  </p>
                )}

                <ul role="group" aria-label={group.label || undefined}>
                  {group.options.map(({ value: option, index }) => {
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

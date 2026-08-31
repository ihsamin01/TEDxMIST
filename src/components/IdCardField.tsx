"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  error?: string;
  /** Set while the form is submitting. */
  disabled?: boolean;
  /** Lets the form know whether a card has been chosen yet. */
  onPick?: (file: File | null) => void;
};

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Picks a photo of the student ID card off the phone or laptop.
 *
 * Deliberately not a controlled input: a file input's value cannot be set
 * from script, so the browser owns it and the form reads the file straight
 * out of it on submit. What React holds is only the preview.
 */
export default function IdCardField({ error, disabled, onPick }: Props) {
  const input = useRef<HTMLInputElement>(null);

  /** The chosen file and its preview URL, which live and die together. */
  const [picked, setPicked] = useState<{ file: File; url: string } | null>(null);

  /** The URL currently handed out, so it can be released on the way out. */
  const objectUrl = useRef<string | null>(null);

  // An object URL is a real allocation. Release the last one on unmount;
  // every earlier one is released in `pick` as it is replaced.
  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  const pick = (chosen: File | null) => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = chosen ? URL.createObjectURL(chosen) : null;

    setPicked(
      chosen && objectUrl.current
        ? { file: chosen, url: objectUrl.current }
        : null,
    );

    onPick?.(chosen);
  };

  const clear = () => {
    pick(null);
    if (input.current) input.current.value = "";
  };

  const file = picked?.file ?? null;
  const tooBig = file !== null && file.size > MAX_BYTES;

  return (
    <div className="sm:col-span-2">
      <label
        htmlFor="id_card"
        className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted uppercase"
      >
        Student ID card
      </label>

      {/* The real input. Hidden, but still the thing that submits. */}
      <input
        ref={input}
        id="id_card"
        name="id_card"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
        aria-invalid={Boolean(error) || tooBig}
        aria-describedby={error ? "id_card-error" : "id_card-hint"}
        className="sr-only"
      />

      {!file ? (
        <label
          htmlFor="id_card"
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition ${
            error
              ? "border-ted bg-ted/5"
              : "border-line bg-ink-soft hover:border-ted/60 hover:bg-ink-soft/70"
          } ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-ted"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="11" r="2" />
            <path d="M14 10h4M14 14h4M5 17c1-2 2.5-3 4-3s3 1 4 3" />
          </svg>

          <span className="text-sm font-bold">
            Tap to upload a photo of your ID card
          </span>

          <span className="text-xs text-muted">
            From your phone or your laptop. JPG, PNG or WebP, up to 5 MB.
          </span>
        </label>
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-ink-soft">
          {picked && (
            // A local object URL, so next/image would only get in the way.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={picked.url}
              alt="The ID card you selected"
              className="max-h-56 w-full bg-black object-contain"
            />
          )}

          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{file.name}</p>
              <p className={`text-xs ${tooBig ? "text-ted" : "text-muted"}`}>
                {(file.size / 1024 / 1024).toFixed(1)} MB
                {tooBig && " (over the 5 MB limit)"}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <label
                htmlFor="id_card"
                className="cursor-pointer rounded-full border border-line px-4 py-2 text-xs font-bold transition hover:border-ted hover:text-ted"
              >
                Replace
              </label>
              <button
                type="button"
                onClick={clear}
                disabled={disabled}
                className="rounded-full border border-line px-4 py-2 text-xs font-bold text-muted transition hover:border-ted hover:text-ted"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <p id="id_card-error" className="mt-2 text-xs font-medium text-ted">
          {error}
        </p>
      ) : (
        <p id="id_card-hint" className="mt-2 text-xs leading-relaxed text-muted">
          Only the organizing team sees this. It is used to check you are a
          student and to confirm which rate applies.
        </p>
      )}
    </div>
  );
}

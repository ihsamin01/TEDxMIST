"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import IdCardField from "./IdCardField";
import Select from "./Select";
import { register } from "@/app/register/actions";
import type { FormState } from "@/app/register/actions";
import { event, feeFor, registration } from "@/config/event";
import { OTHER_UNIVERSITY, universities } from "@/config/universities";
import {
  EMAIL_MESSAGE,
  PHONE_MESSAGE,
  emailOk,
  phoneOk,
} from "@/lib/validation";

/* Shared input styling. */

const inputClass =
  "w-full rounded-xl border bg-ink-soft px-4 py-3 text-[0.95rem] text-white transition outline-none placeholder:text-muted/60 focus:border-ted focus:ring-2 focus:ring-ted/30";

function fieldBorder(hasError: boolean) {
  return hasError ? "border-ted" : "border-line hover:border-white/25";
}

type FieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  /** Renders a dropdown instead of a text input. */
  options?: readonly string[];
  /** Adds a filter box to the dropdown. Worth it past about fifteen options. */
  searchable?: boolean;
  /** Spans both columns. */
  wide?: boolean;
};

function Field({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  options,
  searchable,
  wide,
}: FieldProps) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={name}
        className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted uppercase"
      >
        {label}
      </label>

      {options ? (
        <Select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          options={options}
          searchable={searchable}
          invalid={Boolean(error)}
          describedBy={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`${inputClass} ${fieldBorder(Boolean(error))}`}
        />
      )}

      {error && (
        <p id={`${name}-error`} className="mt-2 text-xs font-medium text-ted">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * A field with nothing to decide. Shown when a list of options has exactly
 * one entry — a dropdown you cannot choose anything in is just a worse label.
 * The hidden input means the form still submits it like any other field.
 */
function FixedField({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 block text-xs font-bold tracking-[0.12em] text-muted uppercase">
        {label}
      </p>

      <input type="hidden" name={name} value={value} />

      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-ink-soft px-4 py-3 text-[0.95rem] font-semibold">
        <span aria-hidden className="h-2 w-2 rounded-full bg-ted" />
        {value}
      </div>
    </div>
  );
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.22em] text-ted uppercase sm:col-span-2">
      {children}
      <span aria-hidden className="h-px flex-1 bg-line" />
    </h2>
  );
}

/* The form. */
/** Set only while exactly one payment method is on offer. */
const ONLY_PAYMENT_METHOD =
  registration.paymentMethods.length === 1 ? registration.paymentMethods[0] : "";

const BLANK = {
  full_name: "",
  email: "",
  phone: "",
  university: "",
  /** Only used when "Other" is picked in the university dropdown. */
  university_other: "",
  department: "",
  study_year: "",
  payment_method: ONLY_PAYMENT_METHOD,
  transaction_id: "",
  tshirt_size: "",
  emergency_contact: "",
  facebook: "",
};

type FieldName = keyof typeof BLANK;

/** Which fields belong to the first screen, so errors land in the right place. */
const STEP_ONE: FieldName[] = [
  "full_name",
  "email",
  "phone",
  "university",
  "university_other",
  "department",
  "study_year",
];

// Lives here because a "use server" file can only export async functions.
const EMPTY_STATE: FormState = { ok: false, message: "", errors: {} };


const YEARS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year",
  "Postgraduate",
  "Graduated",
  "Faculty / staff",
] as const;

/* Step two furniture. */

function VenueCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-soft sm:col-span-2">
      <div className="p-6 sm:p-7">
        <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ted uppercase">
          Where to come
        </p>

        <p className="mt-3 text-lg leading-tight font-black tracking-tight sm:text-xl">
          {event.venue.hall}
        </p>

        <p className="mt-1.5 text-sm leading-relaxed text-white/70">
          {event.venue.name}
          <br />
          {event.venue.address}
        </p>

        <p className="mt-4 text-sm font-semibold">
          {event.dateLabel}
          <span className="mx-2 text-line">|</span>
          {event.timeLabel}
        </p>

        <a
          href={event.venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-bold transition hover:border-ted hover:text-ted"
        >
          Open in Google Maps
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      </div>

      {/* Lazy, so it costs nothing until they reach this step. */}
      <iframe
        src={event.venue.mapEmbedUrl}
        title={`Map showing ${event.venue.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-56 w-full border-0 border-t border-line sm:h-64"
      />
    </div>
  );
}

function PaymentCard({ university }: { university: string }) {
  const fee = feeFor(university);

  return (
    <div className="rounded-2xl border border-ted/40 bg-ted/5 p-6 sm:col-span-2 sm:p-7">
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ted uppercase">
        What you owe
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        {registration.currency} {fee}
      </p>

      {registration.paymentNumber && (
        <div className="mt-6 border-t border-ted/25 pt-5">
          <p className="text-sm leading-relaxed text-white/80">
            Send it to this number first, then enter the transaction ID below.
          </p>

          <p className="mt-3 text-2xl font-black tracking-tight text-ted select-all">
            {registration.paymentNumber}
          </p>

          <p className="mt-2 text-xs text-muted">
            Personal number — use Send Money, not Payment.
          </p>
        </div>
      )}
    </div>
  );
}

function Guidelines() {
  return (
    <div className="rounded-2xl border border-line bg-ink-soft/40 p-6 sm:col-span-2 sm:p-7">
      <p className="text-[0.65rem] font-bold tracking-[0.2em] text-ted uppercase">
        Before you come
      </p>

      <ul className="mt-4 space-y-3">
        {registration.guidelines.map((line) => (
          <li
            key={line}
            className="flex gap-3 text-sm leading-relaxed text-white/75"
          >
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ted"
            />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Steps({ step }: { step: 1 | 2 }) {
  const labels = ["Your details", "Payment"];

  return (
    <ol className="flex items-center gap-3">
      {labels.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const here = step === n;

        return (
          <li key={label} className="flex items-center gap-3">
            <span
              aria-current={here ? "step" : undefined}
              className={`flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase ${
                here ? "text-ted" : done ? "text-white/70" : "text-muted"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[0.7rem] ${
                  here
                    ? "border-ted bg-ted text-white"
                    : done
                      ? "border-white/40 text-white/70"
                      : "border-line text-muted"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </span>

            {n < labels.length && (
              <span aria-hidden className="h-px w-8 bg-line sm:w-12" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, EMPTY_STATE);

  // Controlled, otherwise React clears the form after the action runs and
  // a validation error wipes everything they typed.
  const [values, setValues] = useState(BLANK);
  const [step, setStep] = useState<1 | 2>(1);
  /** The first screen is checked here before anyone is let through. */
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  /** The file input owns the file itself; this is only whether one exists. */
  const [idCard, setIdCard] = useState<File | null>(null);

  const set = (key: FieldName) => (value: string) => {
    setValues((current) => ({ ...current, [key]: value }));

    // Drop the complaint as soon as they start fixing it.
    setLocalErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const error = (key: FieldName) => state.errors[key] ?? localErrors[key];

  /** Did the server reject something that lives on the first screen? */
  const serverHitStepOne =
    STEP_ONE.some((field) => state.errors[field]) ||
    Boolean(state.errors.id_card);

  const goToPayment = () => {
    const found: Record<string, string> = {};

    for (const field of STEP_ONE) {
      // Only asked for when the dropdown says "Other".
      if (
        field === "university_other" &&
        values.university !== OTHER_UNIVERSITY
      ) {
        continue;
      }
      if (!values[field]) found[field] = "This one is needed.";
    }

    if (!idCard) found.id_card = "Attach a photo of your student ID card.";

    if (values.email && !emailOk(values.email)) found.email = EMAIL_MESSAGE;
    if (values.phone && !phoneOk(values.phone)) found.phone = PHONE_MESSAGE;

    setLocalErrors(found);

    if (Object.keys(found).length === 0) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const backToDetails = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-ted/40 bg-ted/5 p-10 text-center sm:p-14">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ted">
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-white"
          >
            <path d="m4 12 6 6L20 6" />
          </svg>
        </div>

        <h2 className="text-3xl font-black tracking-tight">Seat reserved</h2>

        <p className="mx-auto mt-4 max-w-md text-pretty text-white/75">
          {state.message}
        </p>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
          The confirmation lands in your inbox once we have checked your
          transaction ID against our records. If it is not there, look in spam
          and in Gmail&apos;s Promotions tab before writing to us.
        </p>

        <p className="mt-8 text-sm text-muted">
          Questions? Write to{" "}
          <a
            href={`mailto:${event.contact.email}`}
            className="text-ted hover:underline"
          >
            {event.contact.email}
          </a>
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-bold transition hover:border-ted hover:text-ted"
        >
          Back to the site
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-12">
      <Steps step={step} />

      {/* Errors that don't belong to a single field. */}
      {state.message && (
        <p
          role="alert"
          className="rounded-xl border border-ted/50 bg-ted/10 px-5 py-4 text-sm font-medium text-white"
        >
          {state.message}
        </p>
      )}

      {/* The failing field is on the screen behind this one. */}
      {step === 2 && serverHitStepOne && (
        <div
          role="alert"
          className="rounded-xl border border-ted/50 bg-ted/10 px-5 py-4"
        >
          <p className="text-sm font-medium text-white">
            Something on the first step needs fixing.
          </p>
          <button
            type="button"
            onClick={backToDetails}
            className="mt-3 text-sm font-bold text-ted underline underline-offset-4"
          >
            Back to your details
          </button>
        </div>
      )}

      {/*
        Step one stays mounted and is merely hidden on step two, so every
        answer is still in the form when it is finally submitted.
      */}
      <div className={step === 1 ? "space-y-12" : "hidden"}>
        <fieldset className="grid gap-6 sm:grid-cols-2" disabled={pending}>
          <Legend>About you</Legend>

          <Field
            name="full_name"
            label="Full name"
            value={values.full_name}
            onChange={set("full_name")}
            error={error("full_name")}
            wide
          />
          <Field
            name="email"
            label="Email"
            type="email"
            value={values.email}
            onChange={set("email")}
            error={error("email")}
          />
          <Field
            name="phone"
            label="Phone number"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            error={error("phone")}
          />
          <Field
            name="university"
            label="University"
            options={universities}
            searchable
            value={values.university}
            onChange={set("university")}
            error={error("university")}
          />

          {/* Only in the way when the list genuinely does not have them. */}
          {values.university === OTHER_UNIVERSITY && (
            <Field
              name="university_other"
              label="Your university"
              value={values.university_other}
              onChange={set("university_other")}
              error={error("university_other")}
            />
          )}

          <Field
            name="department"
            label="Department"
            value={values.department}
            onChange={set("department")}
            error={error("department")}
          />
          <Field
            name="study_year"
            label="Year"
            options={YEARS}
            value={values.study_year}
            onChange={set("study_year")}
            error={error("study_year")}
          />
          <IdCardField
            error={state.errors.id_card ?? localErrors.id_card}
            disabled={pending}
            onPick={setIdCard}
          />
        </fieldset>

        <div className="border-t border-line pt-8">
          <button
            type="button"
            onClick={goToPayment}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ted px-10 py-4 text-base font-bold tracking-tight text-white transition hover:-translate-y-0.5 hover:bg-ted-dark hover:shadow-[0_10px_30px_-8px_rgba(235,0,40,0.6)] sm:w-auto"
          >
            Continue to payment
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          {Object.keys(localErrors).length > 0 && (
            <p className="mt-4 text-sm font-medium text-ted">
              Fill in the highlighted fields to carry on.
            </p>
          )}
        </div>
      </div>

      <div className={step === 2 ? "space-y-12" : "hidden"}>
        <fieldset className="grid gap-6 sm:grid-cols-2" disabled={pending}>
          <Legend>Venue and payment</Legend>

          <VenueCard />
          <PaymentCard university={values.university} />

          {ONLY_PAYMENT_METHOD ? (
            <FixedField
              name="payment_method"
              label="Payment method"
              value={ONLY_PAYMENT_METHOD}
            />
          ) : (
            <Field
              name="payment_method"
              label="Payment method"
              options={registration.paymentMethods}
              value={values.payment_method}
              onChange={set("payment_method")}
              error={error("payment_method")}
            />
          )}
          <Field
            name="transaction_id"
            label="Transaction ID"
            value={values.transaction_id}
            onChange={set("transaction_id")}
            error={error("transaction_id")}
          />
          <Field
            name="tshirt_size"
            label="T-shirt size"
            options={registration.tshirtSizes}
            value={values.tshirt_size}
            onChange={set("tshirt_size")}
            error={error("tshirt_size")}
          />
          <Field
            name="emergency_contact"
            label="Emergency contact number"
            type="tel"
            value={values.emergency_contact}
            onChange={set("emergency_contact")}
            error={error("emergency_contact")}
          />
          <Field
            name="facebook"
            label="Facebook profile"
            type="url"
            value={values.facebook}
            onChange={set("facebook")}
            error={error("facebook")}
            wide
          />

          <Guidelines />
        </fieldset>

        <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ted px-10 py-4 text-base font-bold tracking-tight text-white transition hover:-translate-y-0.5 hover:bg-ted-dark hover:shadow-[0_10px_30px_-8px_rgba(235,0,40,0.6)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none sm:w-auto"
          >
            {pending ? "Reserving your seat…" : "Submit registration"}
          </button>

          <button
            type="button"
            onClick={backToDetails}
            disabled={pending}
            className="text-sm font-bold text-muted transition-colors hover:text-ted disabled:opacity-60"
          >
            Back to your details
          </button>
        </div>

        <p className="text-xs leading-relaxed text-muted">
          We only use these details to run the event — badges, seating and
          getting in touch if plans change. Nothing is shared outside the
          organizing team.
        </p>
      </div>
    </form>
  );
}

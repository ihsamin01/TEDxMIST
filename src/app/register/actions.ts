"use server";

import { event, registration } from "@/config/event";
import { supabase } from "@/lib/supabase";

export type FormState = {
  ok: boolean;
  message: string;
  /** Keyed by input name, so each field can show its own error. */
  errors: Record<string, string>;
};

/** Everything the form collects, in the order it appears on screen. */
const FIELDS = [
  "full_name",
  "email",
  "phone",
  "university",
  "department",
  "study_year",
  "student_id",
  "payment_method",
  "transaction_id",
  "emergency_contact",
  "facebook",
] as const;

const OPTIONAL = new Set(["facebook"]);

const LABELS: Record<string, string> = {
  full_name: "Full name",
  email: "Email",
  phone: "Phone number",
  university: "University",
  department: "Department",
  study_year: "Year or semester",
  student_id: "Student ID",
  payment_method: "Payment method",
  transaction_id: "Transaction ID",
  emergency_contact: "Emergency contact",
};

/** Bangladeshi mobile numbers, with or without +88. */
const PHONE = /^(\+?88)?01[3-9]\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function register(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!registration.isOpen) {
    return { ok: false, message: "Registration is closed.", errors: {} };
  }

  // 1. Read and trim every field.
  const values: Record<string, string> = {};
  for (const field of FIELDS) {
    values[field] = String(formData.get(field) ?? "").trim();
  }

  // 2. Validate.
  const errors: Record<string, string> = {};

  for (const field of FIELDS) {
    if (!OPTIONAL.has(field) && !values[field]) {
      errors[field] = `${LABELS[field]} is required.`;
    }
  }

  if (values.email && !EMAIL.test(values.email)) {
    errors.email = "That does not look like a valid email address.";
  }

  if (values.phone && !PHONE.test(values.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Use a Bangladeshi mobile number, e.g. 01712345678.";
  }

  if (
    values.emergency_contact &&
    !PHONE.test(values.emergency_contact.replace(/[\s-]/g, ""))
  ) {
    errors.emergency_contact = "Use a Bangladeshi mobile number.";
  }

  if (
    values.payment_method &&
    !registration.paymentMethods.includes(values.payment_method)
  ) {
    errors.payment_method = "Pick one of the listed payment methods.";
  }

  if (values.transaction_id && values.transaction_id.length < 6) {
    errors.transaction_id = "Transaction IDs are at least 6 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  // 3. People type "facebook.com/x" as often as the full URL. Without a
  //    scheme the admin table would render it as a relative link.
  const withScheme = (url: string) =>
    !url || /^https?:\/\//i.test(url) ? url : `https://${url}`;

  values.facebook = withScheme(values.facebook);

  // 4. Stop taking sign-ups once the room is full. Only applies while
  //    registration.capacity is set; rejected rows free their seat back up.
  const db = supabase();

  if (registration.capacity !== null) {
    const { count, error: countError } = await db
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .neq("status", "rejected");

    if (countError) {
      return {
        ok: false,
        message: "Could not reach the database. Please try again in a moment.",
        errors: {},
      };
    }

    if ((count ?? 0) >= registration.capacity) {
      return {
        ok: false,
        message: `Registration is full. Email ${event.contact.email} to join the waiting list.`,
        errors: {},
      };
    }
  }

  // 5. Save.
  const { error } = await db.from("registrations").insert({
    full_name: values.full_name,
    email: values.email.toLowerCase(),
    phone: values.phone,
    university: values.university,
    department: values.department,
    study_year: values.study_year,
    student_id: values.student_id,
    payment_method: values.payment_method,
    transaction_id: values.transaction_id,
    amount: registration.fee || null,
    emergency_contact: values.emergency_contact,
    facebook: values.facebook || null,
  });

  if (error) {
    // 23505 is Postgres' unique violation. Which index tripped tells us
    // whether it was a reused email or a reused receipt.
    if (error.code === "23505") {
      const onEmail = `${error.message} ${error.details ?? ""}`.includes(
        "email",
      );
      return {
        ok: false,
        message: "",
        errors: onEmail
          ? { email: "This email has already registered." }
          : {
              transaction_id:
                "This transaction ID has already been used. Check the number and try again.",
            },
      };
    }

    return {
      ok: false,
      message: "Something went wrong saving your registration. Please try again.",
      errors: {},
    };
  }

  return {
    ok: true,
    message: "You're registered. We'll email you once your payment is verified.",
    errors: {},
  };
}

/**
 * Seats left, for the line above the form. Null whenever there is no agreed
 * capacity, or the database cannot be reached — the page hides the line in
 * both cases rather than guessing a number.
 */
export async function seatsLeft(): Promise<number | null> {
  if (registration.capacity === null) return null;

  try {
    const { count, error } = await supabase()
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .neq("status", "rejected");

    if (error) return null;
    return Math.max(0, registration.capacity - (count ?? 0));
  } catch {
    return null;
  }
}

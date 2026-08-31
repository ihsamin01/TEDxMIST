"use server";

import { event, feeFor, registration } from "@/config/event";
import { OTHER_UNIVERSITY, universities } from "@/config/universities";
import { supabase } from "@/lib/supabase";
import {
  EMAIL_MESSAGE,
  FACEBOOK_MESSAGE,
  PHONE_MESSAGE,
  emailOk,
  facebookOk,
  phoneOk,
  withScheme,
} from "@/lib/validation";

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
  "university_other",
  "department",
  "study_year",
  "student_id",
  "payment_method",
  "transaction_id",
  "tshirt_size",
  "emergency_contact",
  "facebook",
] as const;

/**
 * `university_other` is only required when the dropdown says "Other", which is
 * checked separately below.
 */
const OPTIONAL = new Set(["university_other"]);

const LABELS: Record<string, string> = {
  full_name: "Full name",
  email: "Email",
  phone: "Phone number",
  university: "University",
  university_other: "Your university",
  department: "Department",
  study_year: "Year or semester",
  student_id: "Student ID",
  payment_method: "Payment method",
  transaction_id: "Transaction ID",
  tshirt_size: "T-shirt size",
  emergency_contact: "Emergency contact",
  facebook: "Facebook profile",
};

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

  // People type "facebook.com/x" as often as the full URL, so add the scheme
  // before validating rather than after. It also keeps the link in the admin
  // table absolute.
  values.facebook = withScheme(values.facebook);

  // 2. Validate.
  const errors: Record<string, string> = {};

  for (const field of FIELDS) {
    if (!OPTIONAL.has(field) && !values[field]) {
      errors[field] = `${LABELS[field]} is required.`;
    }
  }

  if (values.email && !emailOk(values.email)) {
    errors.email = EMAIL_MESSAGE;
  }

  if (values.phone && !phoneOk(values.phone)) {
    errors.phone = PHONE_MESSAGE;
  }

  if (values.emergency_contact && !phoneOk(values.emergency_contact)) {
    errors.emergency_contact = PHONE_MESSAGE;
  }

  // The dropdown is a hidden input, so never trust what comes back: it has to
  // be a name we actually offer.
  if (values.university && !universities.includes(values.university)) {
    errors.university = "Pick a university from the list.";
  }

  // "Other" is only a real answer once they have typed the actual name.
  if (values.university === OTHER_UNIVERSITY && !values.university_other) {
    errors.university_other = "Tell us which university you attend.";
  }

  if (
    values.payment_method &&
    !registration.paymentMethods.includes(values.payment_method)
  ) {
    errors.payment_method = "Pick one of the listed payment methods.";
  }

  if (values.facebook && !facebookOk(values.facebook)) {
    errors.facebook = FACEBOOK_MESSAGE;
  }

  if (
    values.tshirt_size &&
    !registration.tshirtSizes.includes(values.tshirt_size)
  ) {
    errors.tshirt_size = "Pick one of the listed T-shirt sizes.";
  }

  if (values.transaction_id && values.transaction_id.length < 6) {
    errors.transaction_id = "Transaction IDs are at least 6 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  // Store what they typed, not the literal "Other (not listed)", so the admin
  // table and the exported CSV read as real university names throughout.
  if (values.university === OTHER_UNIVERSITY) {
    values.university = values.university_other;
  }

  // 4. Stop at capacity, if one is set. Rejected rows free their seat.
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
    tshirt_size: values.tshirt_size,
    // Worked out from the university on the server. The payment step shows
    // the same figure, but what gets stored never depends on that.
    amount: feeFor(values.university),
    emergency_contact: values.emergency_contact,
    facebook: values.facebook,
  });

  if (error) {
    // 23505 is a unique violation. The index name says which field.
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
 * Seats left, for the line above the form. Null if there's no capacity set or
 * the database is unreachable; the page hides the line either way.
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

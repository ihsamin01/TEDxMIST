"use server";

import { revalidatePath } from "next/cache";
import { isSignedIn, signIn, signOut } from "@/lib/admin-auth";
import { sendConfirmationEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";

export type LoginState = { error: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password) return { error: "Enter the password." };
  if (!(await signIn(password))) return { error: "Wrong password." };

  revalidatePath("/admin");
  return { error: "" };
}

export async function logout() {
  await signOut();
  revalidatePath("/admin");
}

/** What the admin table shows after a status change. */
export type StatusResult = {
  ok: boolean;
  /** True when a confirmation email went out as part of this change. */
  emailed: boolean;
  /** Set when the status saved but the email did not. */
  error?: string;
};

/**
 * Sets a registration to pending / confirmed / rejected. Confirming is what
 * sends the email, and only the first time; `confirmation_sent_at` tracks it.
 *
 * Re-checks the session because this is a POST endpoint anyone can hit.
 */
export async function setStatus(
  id: string,
  status: Registration["status"],
): Promise<StatusResult> {
  if (!(await isSignedIn())) throw new Error("Unauthorized");

  if (!["pending", "confirmed", "rejected"].includes(status)) {
    throw new Error("Unknown status");
  }

  const db = supabase();

  // Return the row so the email has the ticket number.
  const { data, error } = await db
    .from("registrations")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  const row = data as Registration;
  revalidatePath("/admin");

  if (status !== "confirmed" || row.confirmation_sent_at) {
    return { ok: true, emailed: false };
  }

  const sent = await sendConfirmationEmail(row);

  if (!sent.ok) {
    // Status saved, email didn't. Say so, so it can be retried.
    return { ok: true, emailed: false, error: sent.error };
  }

  await db
    .from("registrations")
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  return { ok: true, emailed: true };
}

/** Sends the confirmation email again, whatever was sent before. */
export async function resendConfirmation(id: string): Promise<StatusResult> {
  if (!(await isSignedIn())) throw new Error("Unauthorized");

  const db = supabase();

  const { data, error } = await db
    .from("registrations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  const sent = await sendConfirmationEmail(data as Registration);
  if (!sent.ok) return { ok: false, emailed: false, error: sent.error };

  await db
    .from("registrations")
    .update({ confirmation_sent_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/admin");
  return { ok: true, emailed: true };
}

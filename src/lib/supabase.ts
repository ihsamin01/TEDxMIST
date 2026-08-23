import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * It uses the project's secret key, which bypasses row level security, so it
 * must never be imported from a Client Component. The `server-only` import
 * above turns that mistake into a build error rather than a leaked key.
 */

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

/** True once both environment variables are set. */
export const isSupabaseConfigured = Boolean(url && secretKey);

export function supabase() {
  if (!url || !secretKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local (and in the Vercel project settings).",
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** One attendee row, matching supabase/migrations/0001_registrations.sql. */
export type Registration = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  study_year: string;
  student_id: string;
  payment_method: string;
  transaction_id: string;
  amount: number | null;
  emergency_contact: string;
  facebook: string | null;
  status: "pending" | "confirmed" | "rejected";
  /** Sequential, assigned by the database. Printed on the ticket. */
  ticket_no: number | null;
  /** Null until the confirmation email has gone out. */
  confirmation_sent_at: string | null;
};

import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. The secret key bypasses row level security, so
 * this must never reach the browser. The `server-only` import enforces that.
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

/** One row of the registrations table. */
export type Registration = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  university: string;
  department: string;
  study_year: string;
  /** Older rows have a typed number; newer ones have an uploaded card. */
  student_id: string | null;
  /** Path inside the private id-cards bucket. Null on older rows. */
  id_card_path: string | null;
  payment_method: string;
  transaction_id: string;
  /** Null on rows created before the column existed. */
  tshirt_size: string | null;
  amount: number | null;
  emergency_contact: string;
  facebook: string | null;
  status: "pending" | "confirmed" | "rejected";
  /** Assigned by the database. */
  ticket_no: number | null;
  /** Null until the confirmation email is sent. */
  confirmation_sent_at: string | null;
};

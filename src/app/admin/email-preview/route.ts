import { isSignedIn } from "@/lib/admin-auth";
import { confirmationEmailHtml } from "@/lib/email";
import { supabase } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Stand-in when the table is still empty. */
const SAMPLE: Registration = {
  id: "preview",
  created_at: "2026-08-18T10:00:00+06:00",
  full_name: "Nusrat Jahan",
  email: "nusrat@example.com",
  phone: "01712345678",
  university: "MIST",
  department: "Computer Science and Engineering",
  study_year: "3rd year",
  student_id: "202211045",
  payment_method: "bKash",
  transaction_id: "9F7K2LM4XQ",
  amount: 500,
  emergency_contact: "01812345678",
  facebook: null,
  status: "confirmed",
  ticket_no: 42,
  confirmation_sent_at: null,
};

/**
 * GET /admin/email-preview — the confirmation email rendered in the browser.
 *
 * Lets you read and correct the wording before anyone receives it, and works
 * before the Resend domain is verified.
 */
export async function GET() {
  if (!(await isSignedIn())) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Prefer a real row, so the preview shows real lengths of real names.
  let row = SAMPLE;

  try {
    const { data } = await supabase()
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) row = { ...SAMPLE, ...(data as Registration) };
  } catch {
    // Fall back to the sample; a preview is not worth failing over.
  }

  return new Response(confirmationEmailHtml(row), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

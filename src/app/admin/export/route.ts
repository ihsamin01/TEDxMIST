import { isSignedIn } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import type { Registration } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Column order in the exported file, with the heading each one gets. */
const COLUMNS: Array<[keyof Registration, string]> = [
  ["ticket_no", "Ticket"],
  ["created_at", "Registered at"],
  ["full_name", "Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["university", "University"],
  ["department", "Department"],
  ["study_year", "Year"],
  ["student_id", "Student ID"],
  ["payment_method", "Payment method"],
  ["transaction_id", "Transaction ID"],
  ["amount", "Amount"],
  ["emergency_contact", "Emergency contact"],
  ["linkedin", "LinkedIn"],
  ["facebook", "Facebook"],
  ["status", "Status"],
  ["confirmation_sent_at", "Confirmation email sent"],
];

function csvCell(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);

  // A cell starting with one of these is run as a formula by Excel and
  // Sheets. Prefixing an apostrophe keeps it as text.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;

  return `"${safe.replace(/"/g, '""')}"`;
}

/**
 * GET /admin/export — the registrations table as a CSV file.
 * Opens as a spreadsheet in Excel, Numbers or Google Sheets.
 */
export async function GET() {
  if (!(await isSignedIn())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase()
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(`Could not read registrations: ${error.message}`, {
      status: 500,
    });
  }

  const rows = (data ?? []) as Registration[];

  const csv = [
    COLUMNS.map(([, heading]) => csvCell(heading)).join(","),
    ...rows.map((row) => COLUMNS.map(([key]) => csvCell(row[key])).join(",")),
  ].join("\r\n");

  // The BOM makes Excel read the file as UTF-8, so Bangla names survive.
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="tedxmist-registrations.csv"',
      "Cache-Control": "no-store",
    },
  });
}

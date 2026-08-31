import { NextRequest, NextResponse } from "next/server";
import { isSignedIn } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** How long a link to an ID card stays alive, in seconds. */
const LINK_LIFETIME = 60;

/**
 * GET /admin/id-card?row=<registration id>
 *
 * The id-cards bucket is private, so nothing in it has a public URL. This
 * checks the admin session, mints a signed link that expires in a minute, and
 * redirects to it. Nobody without the admin cookie can reach an ID card, and
 * a link that leaks is dead almost immediately.
 */
export async function GET(request: NextRequest) {
  if (!(await isSignedIn())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const row = request.nextUrl.searchParams.get("row");
  if (!row) {
    return new Response("Missing row id", { status: 400 });
  }

  const db = supabase();

  const { data, error } = await db
    .from("registrations")
    .select("id_card_path")
    .eq("id", row)
    .maybeSingle();

  if (error) {
    return new Response(`Could not read that registration: ${error.message}`, {
      status: 500,
    });
  }

  if (!data?.id_card_path) {
    return new Response("No ID card on this registration", { status: 404 });
  }

  const { data: signed, error: signError } = await db.storage
    .from("id-cards")
    .createSignedUrl(data.id_card_path, LINK_LIFETIME);

  if (signError || !signed) {
    return new Response(
      `Could not open that ID card: ${signError?.message ?? "unknown error"}`,
      { status: 500 },
    );
  }

  return NextResponse.redirect(signed.signedUrl);
}

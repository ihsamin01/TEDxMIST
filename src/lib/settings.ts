import "server-only";

import { registration } from "@/config/event";
import { isSupabaseConfigured, supabase } from "./supabase";

/**
 * Whether sign-ups are currently open.
 *
 * The switch lives in the database so the organizers can flip it from /admin
 * without a code change and a redeploy. `registration.isOpen` in config is the
 * fallback, used before the settings table exists and any time the database
 * cannot be reached, so a database wobble never silently closes the door.
 */
export async function isRegistrationOpen(): Promise<boolean> {
  if (!isSupabaseConfigured) return registration.isOpen;

  try {
    const { data, error } = await supabase()
      .from("settings")
      .select("registration_open")
      .maybeSingle();

    if (error || !data) return registration.isOpen;
    return data.registration_open;
  } catch {
    return registration.isOpen;
  }
}

import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  role: "admin" | "parent";
  full_name: string | null;
  email: string | null;
  calendar_token: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, calendar_token")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("[getCurrentProfile] błąd zapytania:", error);
  }

  if (!profile) return null;

  return { ...profile, email: user.email ?? null };
}

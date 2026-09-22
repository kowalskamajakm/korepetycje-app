import "server-only";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/profile";

export async function requireAdmin() {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/panel");
  }

  return profile;
}

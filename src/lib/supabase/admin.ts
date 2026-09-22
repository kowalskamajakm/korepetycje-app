import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Uzywa Secret key - omija RLS, wolno wywolywac tylko z kodu serwerowego
// (np. do tworzenia kont rodzicow), nigdy z komponentu klienckiego.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

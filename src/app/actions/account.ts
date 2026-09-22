"use server";

import { createClient } from "@/lib/supabase/server";

export type PasswordFormState = { error?: string; success?: boolean } | undefined;

export async function changePassword(
  _prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Hasło musi mieć co najmniej 8 znaków." };
  }
  if (password !== confirm) {
    return { error: "Hasła nie są takie same." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Nie udało się zmienić hasła. Spróbuj ponownie." };
  }

  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type StudentAccountFormState = { error?: string } | undefined;

export async function addStudentAccount(
  studentId: string,
  _prevState: StudentAccountFormState,
  formData: FormData
): Promise<StudentAccountFormState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Podaj e-mail i hasło dla konta ucznia." };
  }
  if (password.length < 8) {
    return { error: "Hasło musi mieć co najmniej 8 znaków." };
  }

  const admin = createAdminClient();
  const supabase = await createClient();

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "student" },
    });

  let userId = created?.user?.id;

  if (createError) {
    const alreadyExists = /already been registered|already exists/i.test(
      createError.message
    );
    if (!alreadyExists) {
      return { error: "Nie udało się utworzyć konta: " + createError.message };
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!existingProfile) {
      return {
        error:
          "Konto z tym adresem e-mail już istnieje, ale nie udało się go znaleźć. Sprawdź adres.",
      };
    }
    userId = existingProfile.id;
  }

  if (!userId) {
    return { error: "Nie udało się utworzyć konta ucznia." };
  }

  // Nowe konto tworzone przez wyzwalacz ma domyslnie role 'parent' - dla
  // konta ucznia trzeba to nadpisac na 'student'.
  await admin.from("profiles").update({ role: "student" }).eq("id", userId);

  const { error: linkError } = await supabase
    .from("students")
    .update({ linked_user_id: userId })
    .eq("id", studentId);

  if (linkError) {
    return { error: "Nie udało się powiązać konta z uczniem." };
  }

  revalidatePath(`/uczniowie/${studentId}`);
}

export async function removeStudentAccount(studentId: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase
    .from("students")
    .update({ linked_user_id: null })
    .eq("id", studentId);

  revalidatePath(`/uczniowie/${studentId}`);
}

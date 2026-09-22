"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type ParentFormState = { error?: string } | undefined;

export async function addParentToStudent(
  studentId: string,
  _prevState: ParentFormState,
  formData: FormData
): Promise<ParentFormState> {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim() || null;

  if (!email || !password) {
    return { error: "Podaj e-mail i hasło dla konta rodzica." };
  }
  if (password.length < 8) {
    return { error: "Hasło musi mieć co najmniej 8 znaków." };
  }

  const admin = createAdminClient();

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  let parentId = created?.user?.id;

  if (createError) {
    // Jesli konto z tym mailem juz istnieje - znajdz je i tylko podepnij ucznia.
    const alreadyExists = /already been registered|already exists/i.test(
      createError.message
    );
    if (!alreadyExists) {
      return { error: "Nie udało się utworzyć konta: " + createError.message };
    }

    const supabase = await createClient();
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
    parentId = existingProfile.id;
  }

  if (!parentId) {
    return { error: "Nie udało się utworzyć konta rodzica." };
  }

  const supabase = await createClient();
  const { error: linkError } = await supabase
    .from("parent_students")
    .insert({ parent_id: parentId, student_id: studentId });

  if (linkError && linkError.code !== "23505") {
    return { error: "Nie udało się powiązać rodzica z uczniem." };
  }

  revalidatePath(`/uczniowie/${studentId}`);
}

export async function removeParentFromStudent(
  studentId: string,
  parentId: string
) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase
    .from("parent_students")
    .delete()
    .eq("student_id", studentId)
    .eq("parent_id", parentId);

  revalidatePath(`/uczniowie/${studentId}`);
}

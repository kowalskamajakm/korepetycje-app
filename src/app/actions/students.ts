"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type StudentFormState = { error?: string } | undefined;

function readStudentFields(formData: FormData) {
  return {
    full_name: String(formData.get("full_name") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim() || null,
    subject_2: String(formData.get("subject_2") ?? "").trim() || null,
    level: String(formData.get("level") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    teams_link: String(formData.get("teams_link") ?? "").trim() || null,
  };
}

export async function addStudent(
  _prevState: StudentFormState,
  formData: FormData
) {
  const admin = await requireAdmin();
  const fields = readStudentFields(formData);

  if (!fields.full_name) {
    return { error: "Podaj imię i nazwisko ucznia." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .insert({ ...fields, created_by: admin.id });

  if (error) {
    return { error: "Nie udało się dodać ucznia. Spróbuj ponownie." };
  }

  revalidatePath("/uczniowie");
  redirect("/uczniowie");
}

export async function updateStudent(
  studentId: string,
  _prevState: StudentFormState,
  formData: FormData
) {
  await requireAdmin();
  const fields = readStudentFields(formData);

  if (!fields.full_name) {
    return { error: "Podaj imię i nazwisko ucznia." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update(fields)
    .eq("id", studentId);

  if (error) {
    return { error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidatePath("/uczniowie");
  redirect("/uczniowie");
}

export async function deleteStudent(studentId: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("students").delete().eq("id", studentId);

  revalidatePath("/uczniowie");
}

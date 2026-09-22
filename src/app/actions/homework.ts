"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type HomeworkFormState = { error?: string } | undefined;

function readHomeworkFields(formData: FormData) {
  return {
    student_id: String(formData.get("student_id") ?? ""),
    description: String(formData.get("description") ?? "").trim(),
    due_date: String(formData.get("due_date") ?? "") || null,
  };
}

export async function addHomework(
  _prevState: HomeworkFormState,
  formData: FormData
) {
  const admin = await requireAdmin();
  const fields = readHomeworkFields(formData);

  if (!fields.student_id || !fields.description) {
    return { error: "Wybierz ucznia i opisz zadanie." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("homework")
    .insert({ ...fields, created_by: admin.id });

  if (error) {
    return { error: "Nie udało się dodać zadania. Spróbuj ponownie." };
  }

  revalidatePath("/prace-domowe");
  redirect("/prace-domowe");
}

export async function updateHomework(
  homeworkId: string,
  _prevState: HomeworkFormState,
  formData: FormData
) {
  await requireAdmin();
  const fields = readHomeworkFields(formData);

  if (!fields.student_id || !fields.description) {
    return { error: "Wybierz ucznia i opisz zadanie." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("homework")
    .update(fields)
    .eq("id", homeworkId);

  if (error) {
    return { error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidatePath("/prace-domowe");
  redirect("/prace-domowe");
}

export async function deleteHomework(homeworkId: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("homework").delete().eq("id", homeworkId);

  revalidatePath("/prace-domowe");
}

export async function toggleHomeworkStatus(
  homeworkId: string,
  markDone: boolean
) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase
    .from("homework")
    .update({ status: markDone ? "zrobione" : "do_zrobienia" })
    .eq("id", homeworkId);

  revalidatePath("/prace-domowe");
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import type { LessonStatus } from "@/lib/types";

export type LessonFormState = { error?: string } | undefined;

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function addLesson(
  _prevState: LessonFormState,
  formData: FormData
) {
  const admin = await requireAdmin();

  const student_id = String(formData.get("student_id") ?? "");
  const lesson_date = String(formData.get("lesson_date") ?? "");
  const start_time = String(formData.get("start_time") ?? "");
  const duration_minutes = Number(formData.get("duration_minutes") ?? 60);
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const repeatWeekly = formData.get("repeat_weekly") === "on";
  const repeatCount = repeatWeekly
    ? Math.min(Math.max(Number(formData.get("repeat_count") ?? 1), 1), 52)
    : 1;

  if (!student_id || !lesson_date || !start_time) {
    return { error: "Wybierz ucznia, datę i godzinę." };
  }

  const rows = Array.from({ length: repeatCount }, (_, i) => ({
    student_id,
    lesson_date: addDays(lesson_date, i * 7),
    start_time,
    duration_minutes,
    notes,
    created_by: admin.id,
  }));

  const supabase = await createClient();
  const { error } = await supabase.from("lessons").insert(rows);

  if (error) {
    return { error: "Nie udało się dodać lekcji. Spróbuj ponownie." };
  }

  revalidatePath("/grafik");
  redirect("/grafik");
}

function readLessonFields(formData: FormData) {
  return {
    student_id: String(formData.get("student_id") ?? ""),
    lesson_date: String(formData.get("lesson_date") ?? ""),
    start_time: String(formData.get("start_time") ?? ""),
    duration_minutes: Number(formData.get("duration_minutes") ?? 60),
    status: String(formData.get("status") ?? "zaplanowana") as LessonStatus,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };
}

export async function updateLesson(
  lessonId: string,
  _prevState: LessonFormState,
  formData: FormData
) {
  await requireAdmin();
  const fields = readLessonFields(formData);

  if (!fields.student_id || !fields.lesson_date || !fields.start_time) {
    return { error: "Wybierz ucznia, datę i godzinę." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update(fields)
    .eq("id", lessonId);

  if (error) {
    return { error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidatePath("/grafik");
  redirect("/grafik");
}

export async function deleteLesson(lessonId: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("lessons").delete().eq("id", lessonId);

  revalidatePath("/grafik");
}

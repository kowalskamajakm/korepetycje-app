import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { updateLesson } from "@/app/actions/lessons";
import { LessonForm } from "@/app/(app)/grafik/lesson-form";
import type { Lesson } from "@/lib/types";

export default async function EditLessonPage(
  props: PageProps<"/grafik/[id]">
) {
  await requireAdmin();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: lesson } = (await supabase
    .from("lessons")
    .select(
      "id, student_id, lesson_date, start_time, duration_minutes, status, notes, students(id, full_name, teams_link)"
    )
    .eq("id", id)
    .single()) as { data: Lesson | null };

  if (!lesson) {
    notFound();
  }

  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  const updateLessonWithId = updateLesson.bind(null, lesson.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Edytuj lekcję
      </h1>
      <LessonForm
        action={updateLessonWithId}
        students={students ?? []}
        lesson={lesson}
        submitLabel="Zapisz zmiany"
      />
    </div>
  );
}

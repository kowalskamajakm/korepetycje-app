import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { addLesson } from "@/app/actions/lessons";
import { LessonForm } from "@/app/(app)/grafik/lesson-form";

export default async function NewLessonPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Dodaj lekcję
      </h1>
      <LessonForm
        action={addLesson}
        students={students ?? []}
        submitLabel="Dodaj lekcję"
        allowRepeat
      />
    </div>
  );
}

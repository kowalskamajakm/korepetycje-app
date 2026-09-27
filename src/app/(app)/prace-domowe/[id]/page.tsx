import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { updateHomework } from "@/app/actions/homework";
import { HomeworkForm } from "../homework-form";
import type { Homework } from "@/lib/types";

export default async function EditHomeworkPage(
  props: PageProps<"/prace-domowe/[id]">
) {
  await requireAdmin();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: homework } = (await supabase
    .from("homework")
    .select("id, student_id, description, due_date, status, attachment_path, attachment_size, students(id, full_name)")
    .eq("id", id)
    .single()) as { data: Homework | null };

  if (!homework) {
    notFound();
  }

  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  const updateHomeworkWithId = updateHomework.bind(null, homework.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Edytuj zadanie domowe
      </h1>
      <HomeworkForm
        action={updateHomeworkWithId}
        students={students ?? []}
        homework={homework}
        submitLabel="Zapisz zmiany"
      />
    </div>
  );
}

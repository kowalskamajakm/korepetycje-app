import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { updateStudent } from "@/app/actions/students";
import { StudentForm } from "@/app/(app)/uczniowie/student-form";
import { ParentSection } from "../parent-section";
import type { ParentLink, Student } from "@/lib/types";

export default async function EditStudentPage(
  props: PageProps<"/uczniowie/[id]">
) {
  await requireAdmin();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: student } = (await supabase
    .from("students")
    .select("id, full_name, subject, level, notes, teams_link, created_at")
    .eq("id", id)
    .single()) as { data: Student | null };

  if (!student) {
    notFound();
  }

  const { data: parents } = (await supabase
    .from("parent_students")
    .select("parent_id, profiles(id, full_name, email)")
    .eq("student_id", student.id)) as { data: ParentLink[] | null };

  const updateStudentWithId = updateStudent.bind(null, student.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Edytuj ucznia
      </h1>
      <StudentForm
        action={updateStudentWithId}
        student={student}
        submitLabel="Zapisz zmiany"
      />
      <ParentSection studentId={student.id} parents={parents ?? []} />
    </div>
  );
}

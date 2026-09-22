import { requireAdmin } from "@/lib/supabase/require-admin";
import { addStudent } from "@/app/actions/students";
import { StudentForm } from "@/app/(app)/uczniowie/student-form";

export default async function NewStudentPage() {
  await requireAdmin();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Dodaj ucznia
      </h1>
      <StudentForm action={addStudent} submitLabel="Dodaj ucznia" />
    </div>
  );
}

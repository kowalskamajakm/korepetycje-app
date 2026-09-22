import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { addHomework } from "@/app/actions/homework";
import { HomeworkForm } from "@/app/(app)/prace-domowe/homework-form";

export default async function NewHomeworkPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Dodaj zadanie domowe
      </h1>
      <HomeworkForm
        action={addHomework}
        students={students ?? []}
        submitLabel="Dodaj zadanie"
      />
    </div>
  );
}

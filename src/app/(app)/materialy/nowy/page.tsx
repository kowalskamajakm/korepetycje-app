import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { MaterialForm } from "@/app/(app)/materialy/material-form";

export default async function NewMaterialPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Dodaj materiał
      </h1>
      <MaterialForm students={students ?? []} />
    </div>
  );
}

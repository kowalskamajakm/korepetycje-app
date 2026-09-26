import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { deleteStudent } from "@/app/actions/students";
import type { Student } from "@/lib/types";

export default async function StudentsPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name, subject, subject_2, level, notes, created_at")
    .order("full_name") as { data: Student[] | null };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Uczniowie</h1>
        <Link
          href="/uczniowie/nowy"
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + Dodaj ucznia
        </Link>
      </div>

      {!students || students.length === 0 ? (
        <p className="text-sm text-slate-500">
          Nie masz jeszcze żadnych uczniów. Kliknij „Dodaj ucznia”, żeby dodać
          pierwszego.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Imię i nazwisko</th>
                <th className="px-4 py-3">Przedmiot</th>
                <th className="px-4 py-3">Poziom</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {student.full_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {[student.subject, student.subject_2].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {student.level || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/uczniowie/${student.id}`}
                        className="text-sm text-slate-600 hover:text-slate-900"
                      >
                        Edytuj
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteStudent(student.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Usuń
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

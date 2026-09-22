"use client";

import { useActionState } from "react";
import Link from "next/link";
import { addMaterial } from "@/app/actions/materials";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function MaterialForm({
  students,
}: {
  students: { id: string; full_name: string }[];
}) {
  const [state, formAction, pending] = useActionState(addMaterial, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Tytuł
        </label>
        <input name="title" required className={inputClass} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Dla kogo
        </label>
        <select name="student_id" defaultValue="" className={inputClass}>
          <option value="">Ogólnodostępny (widoczny dla wszystkich)</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Plik (max 20 MB)
        </label>
        <input
          type="file"
          name="file"
          required
          className="w-full text-sm text-slate-700"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Wgrywanie…" : "Dodaj materiał"}
        </button>
        <Link href="/materialy" className="text-sm text-slate-500 hover:text-slate-800">
          Anuluj
        </Link>
      </div>
    </form>
  );
}

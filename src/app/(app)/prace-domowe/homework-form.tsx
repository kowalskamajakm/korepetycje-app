"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { HomeworkFormState } from "@/app/actions/homework";
import type { Homework } from "@/lib/types";

type Action = (
  state: HomeworkFormState,
  formData: FormData
) => Promise<HomeworkFormState>;

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function HomeworkForm({
  action,
  students,
  homework,
  submitLabel,
}: {
  action: Action;
  students: { id: string; full_name: string }[];
  homework?: Homework;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Uczeń
        </label>
        <select
          name="student_id"
          required
          defaultValue={homework?.student_id ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Wybierz ucznia
          </option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Zadanie
        </label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={homework?.description}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Termin (opcjonalnie)
        </label>
        <input
          type="date"
          name="due_date"
          defaultValue={homework?.due_date ?? ""}
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Zapisywanie…" : submitLabel}
        </button>
        <Link href="/prace-domowe" className="text-sm text-slate-500 hover:text-slate-800">
          Anuluj
        </Link>
      </div>
    </form>
  );
}

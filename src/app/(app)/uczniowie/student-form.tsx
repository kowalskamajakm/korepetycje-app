"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { StudentFormState } from "@/app/actions/students";
import type { Student } from "@/lib/types";

type Action = (
  state: StudentFormState,
  formData: FormData
) => Promise<StudentFormState>;

export function StudentForm({
  action,
  student,
  submitLabel,
}: {
  action: Action;
  student?: Student;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-slate-700">
          Imię i nazwisko
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          defaultValue={student?.full_name}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-700">
            Przedmiot 1
          </label>
          <input
            id="subject"
            name="subject"
            defaultValue={student?.subject ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label htmlFor="subject_2" className="mb-1 block text-sm font-medium text-slate-700">
            Przedmiot 2 (opcjonalnie)
          </label>
          <input
            id="subject_2"
            name="subject_2"
            defaultValue={student?.subject_2 ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="level" className="mb-1 block text-sm font-medium text-slate-700">
          Poziom / klasa
        </label>
        <input
          id="level"
          name="level"
          defaultValue={student?.level ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label htmlFor="teams_link" className="mb-1 block text-sm font-medium text-slate-700">
          Link do spotkania (Teams)
        </label>
        <input
          id="teams_link"
          name="teams_link"
          type="url"
          placeholder="https://teams.microsoft.com/..."
          defaultValue={student?.teams_link ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <p className="mt-1 text-xs text-slate-500">
          Ten sam link będzie dodawany do każdego mailowego przypomnienia o lekcji dla tego ucznia.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
          Notatki
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          defaultValue={student?.notes ?? ""}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
        <Link href="/uczniowie" className="text-sm text-slate-500 hover:text-slate-800">
          Anuluj
        </Link>
      </div>
    </form>
  );
}

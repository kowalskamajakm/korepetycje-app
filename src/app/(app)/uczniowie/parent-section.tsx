"use client";

import { useActionState } from "react";
import {
  addParentToStudent,
  removeParentFromStudent,
  type ParentFormState,
} from "@/app/actions/parents";
import type { ParentLink } from "@/lib/types";

export function ParentSection({
  studentId,
  parents,
}: {
  studentId: string;
  parents: ParentLink[];
}) {
  const boundAdd = addParentToStudent.bind(null, studentId);
  const [state, formAction, pending] = useActionState<
    ParentFormState,
    FormData
  >(boundAdd, undefined);

  return (
    <div className="mt-10 max-w-lg">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">
        Rodzice / opiekunowie
      </h2>

      {parents.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          Brak podpiętych kont rodziców.
        </p>
      ) : (
        <ul className="mb-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-surface">
          {parents.map((p) => (
            <li
              key={p.parent_id}
              className="flex items-center justify-between px-4 py-2 text-sm"
            >
              <span>
                {p.profiles?.full_name || p.profiles?.email || p.parent_id}
              </span>
              <form
                action={removeParentFromStudent.bind(
                  null,
                  studentId,
                  p.parent_id
                )}
              >
                <button
                  type="submit"
                  className="text-red-600 hover:text-red-800"
                >
                  Odepnij
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <details className="rounded-lg border border-slate-200 bg-surface p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          + Dodaj rodzica
        </summary>
        <form action={formAction} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Imię i nazwisko (opcjonalnie)
            </label>
            <input
              name="full_name"
              className="w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Hasło tymczasowe (min. 8 znaków)
            </label>
            <input
              name="password"
              type="text"
              required
              minLength={8}
              className="w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft"
            />
            <p className="mt-1 text-xs text-slate-500">
              Przekaż to hasło rodzicowi — po pierwszym logowaniu nie da się
              go tu zobaczyć ponownie. Jeśli rodzic ma już konto (np. drugi
              rodzic tego samego ucznia albo rodzeństwa), wpisz jego istniejący
              e-mail — hasło zostanie wtedy zignorowane, a uczeń po prostu
              zostanie podpięty do tego konta.
            </p>
          </div>

          {state?.error && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {pending ? "Zapisywanie…" : "Dodaj rodzica"}
          </button>
        </form>
      </details>
    </div>
  );
}

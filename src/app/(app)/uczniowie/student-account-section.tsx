"use client";

import { useActionState } from "react";
import {
  addStudentAccount,
  removeStudentAccount,
  type StudentAccountFormState,
} from "@/app/actions/student-account";
import type { StudentAccount } from "@/lib/types";

export function StudentAccountSection({
  studentId,
  account,
}: {
  studentId: string;
  account: StudentAccount;
}) {
  const boundAdd = addStudentAccount.bind(null, studentId);
  const [state, formAction, pending] = useActionState<
    StudentAccountFormState,
    FormData
  >(boundAdd, undefined);

  return (
    <div className="mt-10 max-w-lg">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">
        Konto ucznia
      </h2>

      {account ? (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm">
          <span>{account.full_name || account.email || account.id}</span>
          <form action={removeStudentAccount.bind(null, studentId)}>
            <button type="submit" className="text-red-600 hover:text-red-800">
              Odepnij
            </button>
          </form>
        </div>
      ) : (
        <p className="mb-4 text-sm text-slate-500">
          Ten uczeń nie ma jeszcze własnego konta logowania.
        </p>
      )}

      {!account && (
        <details className="rounded-lg border border-slate-200 bg-white p-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">
            + Utwórz konto dla ucznia
          </summary>
          <form action={formAction} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                E-mail ucznia
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                Przekaż to hasło uczniowi — będzie widział te same sekcje co
                rodzic (grafik, płatności, prace domowe, materiały), tylko
                dla siebie.
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
              {pending ? "Zapisywanie…" : "Utwórz konto"}
            </button>
          </form>
        </details>
      )}
    </div>
  );
}

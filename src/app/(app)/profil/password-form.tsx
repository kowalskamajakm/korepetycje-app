"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/account";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, undefined);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nowe hasło
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Powtórz nowe hasło
        </label>
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-green-700">Hasło zostało zmienione.</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Zapisywanie…" : "Zmień hasło"}
      </button>
    </form>
  );
}

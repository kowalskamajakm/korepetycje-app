"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { PaymentFormState } from "@/app/actions/payments";
import type { Payment } from "@/lib/types";

type Action = (
  state: PaymentFormState,
  formData: FormData
) => Promise<PaymentFormState>;

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft";

export function PaymentForm({
  action,
  students,
  payment,
  submitLabel,
}: {
  action: Action;
  students: { id: string; full_name: string }[];
  payment?: Payment;
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
          defaultValue={payment?.student_id ?? ""}
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
          Opis (np. „Wrzesień 2026 – 4 lekcje”)
        </label>
        <input
          name="description"
          required
          defaultValue={payment?.description}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Kwota (zł)
          </label>
          <input
            type="number"
            name="amount"
            min={0}
            step={0.01}
            required
            defaultValue={payment?.amount}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Termin płatności
          </label>
          <input
            type="date"
            name="due_date"
            required
            defaultValue={payment?.due_date}
            className={inputClass}
          />
        </div>
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
        <Link href="/platnosci" className="text-sm text-slate-500 hover:text-slate-800">
          Anuluj
        </Link>
      </div>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { sendRemindersNow } from "@/app/actions/reminders";

export function SendRemindersButton() {
  const [state, formAction, pending] = useActionState(sendRemindersNow, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Wysyłanie…" : "Wyślij przypomnienia teraz"}
      </button>

      {state?.done && (
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <p>
            Wysłano przypomnień: <strong>{state.lessons}</strong> o lekcjach,{" "}
            <strong>{state.payments}</strong> o płatnościach.
          </p>
          {state.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-red-600">
              {state.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}

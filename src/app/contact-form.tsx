"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/app/actions/contact";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, undefined);

  if (state?.success) {
    return (
      <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        Dziękuję za wiadomość! Odezwę się najszybciej, jak to możliwe.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot pole - ukryte dla ludzi, wypelniane przez boty */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px]"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
          Imię
        </label>
        <input id="name" name="name" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          E-mail
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
          Wiadomość
        </label>
        <textarea id="message" name="message" required rows={4} className={inputClass} />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}

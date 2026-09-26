"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { LessonFormState } from "@/app/actions/lessons";
import type { Lesson } from "@/lib/types";

type Action = (
  state: LessonFormState,
  formData: FormData
) => Promise<LessonFormState>;

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft";

export function LessonForm({
  action,
  students,
  lesson,
  submitLabel,
  allowRepeat,
}: {
  action: Action;
  students: { id: string; full_name: string }[];
  lesson?: Lesson;
  submitLabel: string;
  allowRepeat?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [repeatWeekly, setRepeatWeekly] = useState(false);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Uczeń
        </label>
        <select
          name="student_id"
          required
          defaultValue={lesson?.student_id ?? ""}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Data
          </label>
          <input
            type="date"
            name="lesson_date"
            required
            defaultValue={lesson?.lesson_date}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Godzina
          </label>
          <input
            type="time"
            name="start_time"
            required
            defaultValue={lesson?.start_time?.slice(0, 5)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Czas trwania (minuty)
        </label>
        <input
          type="number"
          name="duration_minutes"
          min={15}
          step={15}
          defaultValue={lesson?.duration_minutes ?? 60}
          className={inputClass}
        />
      </div>

      {lesson && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            name="status"
            defaultValue={lesson.status}
            className={inputClass}
          >
            <option value="zaplanowana">Zaplanowana</option>
            <option value="odbyta">Odbyta</option>
            <option value="odwolana">Odwołana</option>
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Notatki
        </label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={lesson?.notes ?? ""}
          className={inputClass}
        />
      </div>

      {allowRepeat && (
        <div className="rounded-lg border border-slate-200 p-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="repeat_weekly"
              checked={repeatWeekly}
              onChange={(e) => setRepeatWeekly(e.target.checked)}
            />
            Powtarzaj co tydzień
          </label>
          {repeatWeekly && (
            <div className="mt-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Liczba lekcji (łącznie z tą)
              </label>
              <input
                type="number"
                name="repeat_count"
                min={2}
                max={52}
                defaultValue={4}
                className={inputClass}
              />
            </div>
          )}
        </div>
      )}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? "Zapisywanie…" : submitLabel}
        </button>
        <Link href="/grafik" className="text-sm text-slate-500 hover:text-slate-800">
          Anuluj
        </Link>
      </div>
    </form>
  );
}

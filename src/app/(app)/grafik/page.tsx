import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { ScheduleView } from "@/app/(app)/grafik/schedule-view";
import type { Lesson } from "@/lib/types";

function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function SchedulePage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const supabase = await createClient();

  const { data: lessons } = (await supabase
    .from("lessons")
    .select(
      "id, student_id, lesson_date, start_time, duration_minutes, status, notes, students(id, full_name)"
    )
    .gte("lesson_date", isoDaysFromNow(-90))
    .lte("lesson_date", isoDaysFromNow(270))
    .order("lesson_date")
    .order("start_time")) as { data: Lesson[] | null };

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const isLocal = host.includes("localhost") || host.startsWith("127.0.0.1");
  const feedUrl = `https://${host}/calendar/${profile?.calendar_token}`;
  const webcalUrl = `webcal://${host}/calendar/${profile?.calendar_token}`;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Grafik</h1>
        {isAdmin && (
          <Link
            href="/grafik/nowa"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            + Dodaj lekcję
          </Link>
        )}
      </div>

      <ScheduleView lessons={lessons ?? []} isAdmin={isAdmin} />

      <details className="mt-10 max-w-lg rounded-lg border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          📅 Subskrybuj ten grafik w kalendarzu iPhone
        </summary>
        <div className="mt-3 space-y-3 text-sm text-slate-600">
          {isLocal && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
              Ta funkcja zadziała na iPhonie dopiero, gdy aplikacja będzie
              opublikowana w internecie (na razie działa tylko lokalnie na
              tym komputerze).
            </p>
          )}
          <p>
            Ten link jest prywatny — pokazuje tylko Twoje lekcje. Nie udostępniaj go nikomu.
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Na iPhonie: <strong>Ustawienia → Aplikacje → Kalendarz → Konta → Dodaj konto → Inne → Dodaj subskrybowany kalendarz</strong>.
            </li>
            <li>Wklej poniższy link i zapisz.</li>
            <li>Lekcje będą się automatycznie pojawiać (odświeżanie co kilka godzin).</li>
          </ol>
          <div className="break-all rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
            {feedUrl}
          </div>
          {!isLocal && (
            <a
              href={webcalUrl}
              className="inline-block rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Otwórz w Kalendarzu (na iPhonie)
            </a>
          )}
        </div>
      </details>
    </div>
  );
}

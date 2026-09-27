"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Video } from "lucide-react";
import { deleteLesson } from "@/app/actions/lessons";
import type { Lesson } from "@/lib/types";

const statusLabels: Record<string, string> = {
  zaplanowana: "Zaplanowana",
  odbyta: "Odbyta",
  odwolana: "Odwołana",
};

const statusStyles: Record<string, string> = {
  zaplanowana: "bg-blue-100 text-blue-700 border-blue-200",
  odbyta: "bg-green-100 text-green-700 border-green-200",
  odwolana: "bg-slate-100 text-slate-400 border-slate-200 line-through",
};

const DAY_LABELS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
const WEEK_START_HOUR = 7;
const WEEK_END_HOUR = 21;
const HOUR_HEIGHT = 48;

function toDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00Z");
}
function fromDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr: string, days: number) {
  const d = toDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return fromDate(d);
}
function mondayOf(dateStr: string) {
  const d = toDate(dateStr);
  const day = d.getUTCDay() || 7; // niedziela = 7
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return fromDate(d);
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function formatMonthLabel(dateStr: string) {
  return new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(
    toDate(dateStr)
  );
}
function formatDayLabel(dateStr: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long" }).format(
    toDate(dateStr)
  );
}

function LessonPill({ lesson, isAdmin }: { lesson: Lesson; isAdmin: boolean }) {
  const content = (
    <div
      className={`truncate rounded border px-1.5 py-0.5 text-[11px] leading-tight ${statusStyles[lesson.status]}`}
      title={`${lesson.start_time.slice(0, 5)} ${lesson.students?.full_name ?? ""}`}
    >
      {lesson.start_time.slice(0, 5)} {lesson.students?.full_name ?? "—"}
    </div>
  );
  return isAdmin ? (
    <Link key={lesson.id} href={`/grafik/${lesson.id}`}>
      {content}
    </Link>
  ) : (
    <div key={lesson.id}>{content}</div>
  );
}

function MonthView({
  lessons,
  refDate,
  isAdmin,
}: {
  lessons: Lesson[];
  refDate: string;
  isAdmin: boolean;
}) {
  const byDate = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    for (const l of lessons) {
      const list = map.get(l.lesson_date) ?? [];
      list.push(l);
      map.set(l.lesson_date, list);
    }
    return map;
  }, [lessons]);

  const monthStart = refDate.slice(0, 8) + "01";
  const gridStart = mondayOf(monthStart);
  const currentMonth = toDate(refDate).getUTCMonth();
  const today = todayStr();

  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  return (
    <div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-t-lg border border-b-0 border-slate-200 bg-slate-200 text-center text-xs font-medium text-slate-500">
        {DAY_LABELS.map((d) => (
          <div key={d} className="bg-slate-50 py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-lg border border-slate-200 bg-slate-200">
        {days.map((day) => {
          const dayLessons = byDate.get(day) ?? [];
          const inMonth = toDate(day).getUTCMonth() === currentMonth;
          return (
            <div
              key={day}
              className={`min-h-24 bg-surface p-1 ${inMonth ? "" : "bg-slate-50 text-slate-300"}`}
            >
              <div
                className={`mb-1 text-xs ${day === today ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 font-medium text-white" : "text-slate-500"}`}
              >
                {Number(day.slice(8, 10))}
              </div>
              <div className="space-y-0.5">
                {dayLessons.slice(0, 3).map((l) => (
                  <LessonPill key={l.id} lesson={l} isAdmin={isAdmin} />
                ))}
                {dayLessons.length > 3 && (
                  <div className="text-[11px] text-slate-400">
                    +{dayLessons.length - 3} więcej
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  lessons,
  refDate,
  isAdmin,
}: {
  lessons: Lesson[];
  refDate: string;
  isAdmin: boolean;
}) {
  const weekStart = mondayOf(refDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from(
    { length: WEEK_END_HOUR - WEEK_START_HOUR + 1 },
    (_, i) => WEEK_START_HOUR + i
  );
  const gridHeight = (WEEK_END_HOUR - WEEK_START_HOUR) * HOUR_HEIGHT;
  const today = todayStr();

  const byDate = useMemo(() => {
    const map = new Map<string, Lesson[]>();
    for (const l of lessons) {
      const list = map.get(l.lesson_date) ?? [];
      list.push(l);
      map.set(l.lesson_date, list);
    }
    return map;
  }, [lessons]);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-surface">
      <div className="grid min-w-[700px] grid-cols-[50px_repeat(7,1fr)]">
        <div />
        {days.map((day) => (
          <div
            key={day}
            className={`border-b border-l border-slate-200 py-2 text-center text-xs font-medium ${
              day === today ? "bg-indigo-600 text-white" : "text-slate-600"
            }`}
          >
            {new Intl.DateTimeFormat("pl-PL", { weekday: "short" }).format(toDate(day))}{" "}
            {Number(day.slice(8, 10))}
          </div>
        ))}

        <div style={{ height: gridHeight }} className="relative">
          {hours.map((h, i) => (
            <div
              key={h}
              style={{ top: i * HOUR_HEIGHT }}
              className="absolute right-1 -translate-y-2 text-[11px] text-slate-400"
            >
              {h}:00
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dayLessons = byDate.get(day) ?? [];
          return (
            <div
              key={day}
              style={{ height: gridHeight }}
              className="relative border-l border-slate-200"
            >
              {hours.map((h, i) => (
                <div
                  key={h}
                  style={{ top: i * HOUR_HEIGHT }}
                  className="absolute h-px w-full bg-slate-100"
                />
              ))}
              {dayLessons.map((lesson) => {
                const [h, m] = lesson.start_time.split(":").map(Number);
                const startMinutes = h * 60 + m - WEEK_START_HOUR * 60;
                const top = (startMinutes / 60) * HOUR_HEIGHT;
                const height = Math.max(
                  (lesson.duration_minutes / 60) * HOUR_HEIGHT,
                  18
                );
                const block = (
                  <div
                    className={`absolute left-0.5 right-0.5 overflow-hidden rounded border px-1 py-0.5 text-[11px] leading-tight ${statusStyles[lesson.status]}`}
                    style={{ top, height }}
                    title={`${lesson.start_time.slice(0, 5)} ${lesson.students?.full_name ?? ""}`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-medium">
                        {lesson.start_time.slice(0, 5)}
                      </span>
                      {lesson.students?.teams_link && (
                        <a
                          href={lesson.students.teams_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-accent"
                          title="Link do Teams"
                        >
                          <Video className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <div className="truncate">
                      {lesson.students?.full_name ?? "—"}
                    </div>
                  </div>
                );
                return isAdmin ? (
                  <Link key={lesson.id} href={`/grafik/${lesson.id}`}>
                    {block}
                  </Link>
                ) : (
                  <div key={lesson.id}>{block}</div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function groupByDate(lessons: Lesson[]) {
  const grouped = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const list = grouped.get(lesson.lesson_date) ?? [];
    list.push(lesson);
    grouped.set(lesson.lesson_date, list);
  }
  return grouped;
}

function DayGroupedList({ lessons, isAdmin }: { lessons: Lesson[]; isAdmin: boolean }) {
  const grouped = groupByDate(lessons);

  return (
    <div className="space-y-6">
      {Array.from(grouped.entries()).map(([date, dayLessons]) => (
        <div key={date}>
          <h2 className="mb-2 text-sm font-medium capitalize text-slate-500">
            {formatDayLabel(date)}
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
            <ul className="divide-y divide-slate-100">
              {dayLessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-slate-900">
                      {lesson.start_time.slice(0, 5)}
                    </span>
                    <span className="text-slate-700">
                      {lesson.students?.full_name ?? "—"}
                    </span>
                    <span className="text-slate-400">
                      {lesson.duration_minutes} min
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${statusStyles[lesson.status]}`}
                    >
                      {statusLabels[lesson.status]}
                    </span>
                    {lesson.students?.teams_link && (
                      <a
                        href={lesson.students.teams_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:underline"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Teams
                      </a>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/grafik/${lesson.id}`}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        Edytuj
                      </Link>
                      <form action={deleteLesson.bind(null, lesson.id)}>
                        <button
                          type="submit"
                          className="text-red-600 hover:text-red-800"
                        >
                          Usuń
                        </button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({ lessons, isAdmin }: { lessons: Lesson[]; isAdmin: boolean }) {
  const today = todayStr();

  const upcoming = lessons
    .filter((l) => l.lesson_date >= today)
    .sort(
      (a, b) =>
        a.lesson_date.localeCompare(b.lesson_date) ||
        a.start_time.localeCompare(b.start_time)
    );

  const past = lessons
    .filter((l) => l.lesson_date < today)
    .sort(
      (a, b) =>
        b.lesson_date.localeCompare(a.lesson_date) ||
        b.start_time.localeCompare(a.start_time)
    );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-base font-semibold text-slate-900">Nadchodzące</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">Brak zaplanowanych lekcji od dziś.</p>
        ) : (
          <DayGroupedList lessons={upcoming} isAdmin={isAdmin} />
        )}
      </section>

      {past.length > 0 && (
        <details>
          <summary className="mb-3 cursor-pointer text-base font-semibold text-slate-900">
            Odbyte ({past.length})
          </summary>
          <DayGroupedList lessons={past} isAdmin={isAdmin} />
        </details>
      )}
    </div>
  );
}

export function ScheduleView({
  lessons,
  isAdmin,
}: {
  lessons: Lesson[];
  isAdmin: boolean;
}) {
  const [mode, setMode] = useState<"lista" | "miesiac" | "tydzien">("lista");
  const [refDate, setRefDate] = useState(todayStr());

  const step = (dir: 1 | -1) => {
    if (mode === "tydzien") setRefDate((d) => addDays(d, dir * 7));
    else if (mode === "miesiac") {
      const d = toDate(refDate);
      d.setUTCMonth(d.getUTCMonth() + dir);
      setRefDate(fromDate(d));
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-slate-200 bg-surface p-0.5 text-sm">
          {(["lista", "miesiac", "tydzien"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded px-3 py-1.5 capitalize transition ${
                mode === m ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {m === "lista" ? "Lista" : m === "miesiac" ? "Miesiąc" : "Tydzień"}
            </button>
          ))}
        </div>

        {mode !== "lista" && (
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => step(-1)}
              className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-100"
            >
              ←
            </button>
            <span className="min-w-32 text-center font-medium capitalize text-slate-700">
              {mode === "miesiac"
                ? formatMonthLabel(refDate)
                : `Tydzień od ${formatDayLabel(mondayOf(refDate))}`}
            </span>
            <button
              onClick={() => step(1)}
              className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-100"
            >
              →
            </button>
            <button
              onClick={() => setRefDate(todayStr())}
              className="rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-100"
            >
              Dziś
            </button>
          </div>
        )}
      </div>

      {mode === "lista" && <ListView lessons={lessons} isAdmin={isAdmin} />}
      {mode === "miesiac" && (
        <MonthView lessons={lessons} refDate={refDate} isAdmin={isAdmin} />
      )}
      {mode === "tydzien" && (
        <WeekView lessons={lessons} refDate={refDate} isAdmin={isAdmin} />
      )}
    </div>
  );
}

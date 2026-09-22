function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function toIcsDateTime(dateStr: string, timeStr: string) {
  // Czas "plywajacy" (bez Z / TZID) - urzadzenie interpretuje go w swojej
  // wlasnej strefie, co pasuje tu, bo caly system dziala w jednej strefie.
  return `${dateStr.replace(/-/g, "")}T${timeStr.replace(/:/g, "").slice(0, 6)}`;
}

function addMinutes(dateStr: string, timeStr: string, minutes: number) {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCHours(h, m + minutes, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`,
  };
}

export type IcsLesson = {
  id: string;
  lesson_date: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  studentName: string;
};

export function buildLessonsIcs(lessons: IcsLesson[], calendarName: string) {
  const now = new Date();
  const dtstamp =
    now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Panel korepetytora//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    "REFRESH-INTERVAL;VALUE=DURATION:PT3H",
    "X-PUBLISHED-TTL:PT3H",
  ];

  for (const lesson of lessons) {
    const end = addMinutes(lesson.lesson_date, lesson.start_time, lesson.duration_minutes);
    lines.push(
      "BEGIN:VEVENT",
      `UID:lekcja-${lesson.id}@panel-korepetytora`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${toIcsDateTime(lesson.lesson_date, lesson.start_time)}`,
      `DTEND:${toIcsDateTime(end.date, end.time)}`,
      `SUMMARY:${escapeText("Korepetycje - " + lesson.studentName)}`,
      `STATUS:${lesson.status === "odwolana" ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

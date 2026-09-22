import { createAdminClient } from "@/lib/supabase/admin";
import { buildLessonsIcs } from "@/lib/ics";

function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/calendar/[token]">
) {
  const { token } = await ctx.params;

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, full_name")
    .eq("calendar_token", token)
    .maybeSingle();

  if (!profile) {
    return new Response("Not found", { status: 404 });
  }

  let studentIds: string[] | null = null;
  if (profile.role !== "admin") {
    const { data: links } = await admin
      .from("parent_students")
      .select("student_id")
      .eq("parent_id", profile.id);
    studentIds = (links ?? []).map((l) => l.student_id);
    if (studentIds.length === 0) {
      const empty = buildLessonsIcs([], "Korepetycje");
      return new Response(empty, {
        headers: { "Content-Type": "text/calendar; charset=utf-8" },
      });
    }
  }

  let query = admin
    .from("lessons")
    .select("id, lesson_date, start_time, duration_minutes, status, students(full_name)")
    .gte("lesson_date", isoDaysFromNow(-90))
    .lte("lesson_date", isoDaysFromNow(270));

  if (studentIds) {
    query = query.in("student_id", studentIds);
  }

  const { data: lessons } = await query;

  const ics = buildLessonsIcs(
    (lessons ?? []).map((l) => ({
      id: l.id,
      lesson_date: l.lesson_date,
      start_time: l.start_time,
      duration_minutes: l.duration_minutes,
      status: l.status,
      studentName:
        (l.students as unknown as { full_name: string } | null)?.full_name ??
        "uczeń",
    })),
    "Korepetycje"
  );

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="korepetycje.ics"',
    },
  });
}

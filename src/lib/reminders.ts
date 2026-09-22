import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(dateStr + "T00:00:00"));
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
}

async function getParentEmails(
  admin: ReturnType<typeof createAdminClient>,
  studentId: string
) {
  const { data } = await admin
    .from("parent_students")
    .select("profiles(email, full_name)")
    .eq("student_id", studentId);

  return ((data ?? []) as unknown as { profiles: { email: string | null; full_name: string | null } | null }[])
    .map((d) => d.profiles)
    .filter((p): p is { email: string; full_name: string | null } => !!p?.email);
}

export type ReminderResult = {
  lessons: number;
  payments: number;
  errors: string[];
};

export async function runReminders(): Promise<ReminderResult> {
  const admin = createAdminClient();
  const result: ReminderResult = { lessons: 0, payments: 0, errors: [] };

  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  })();

  const { data: lessons } = await admin
    .from("lessons")
    .select("id, lesson_date, start_time, duration_minutes, student_id, students(full_name, teams_link)")
    .eq("lesson_date", tomorrow)
    .eq("status", "zaplanowana");

  for (const lesson of (lessons ?? []) as unknown as {
    id: string;
    lesson_date: string;
    start_time: string;
    duration_minutes: number;
    student_id: string;
    students: { full_name: string; teams_link: string | null } | null;
  }[]) {
    const { data: already } = await admin
      .from("reminder_log")
      .select("id")
      .eq("kind", "lekcja")
      .eq("reference_id", lesson.id)
      .maybeSingle();
    if (already) continue;

    const parents = await getParentEmails(admin, lesson.student_id);
    if (parents.length === 0) continue;

    const studentName = lesson.students?.full_name ?? "uczeń";
    const teamsLink = lesson.students?.teams_link;
    const html = `
      <p>Przypomnienie o jutrzejszej lekcji.</p>
      <p><strong>Uczeń:</strong> ${studentName}<br/>
      <strong>Data:</strong> ${formatDate(lesson.lesson_date)}<br/>
      <strong>Godzina:</strong> ${lesson.start_time.slice(0, 5)}<br/>
      <strong>Czas trwania:</strong> ${lesson.duration_minutes} min</p>
      ${teamsLink ? `<p><a href="${teamsLink}">Dołącz do spotkania na Teams</a></p>` : ""}
    `;

    for (const parent of parents) {
      try {
        await sendEmail({
          to: parent.email,
          subject: `Przypomnienie: lekcja jutro o ${lesson.start_time.slice(0, 5)}`,
          html,
        });
      } catch {
        result.errors.push(`Lekcja ${lesson.id}: błąd wysyłki do ${parent.email}`);
      }
    }

    await admin.from("reminder_log").insert({ kind: "lekcja", reference_id: lesson.id });
    result.lessons++;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data: payments } = await admin
    .from("payments")
    .select("id, description, amount, due_date, student_id, students(full_name)")
    .lt("due_date", today)
    .eq("status", "nieoplacone");

  for (const payment of (payments ?? []) as unknown as {
    id: string;
    description: string;
    amount: number;
    due_date: string;
    student_id: string;
    students: { full_name: string } | null;
  }[]) {
    const { data: already } = await admin
      .from("reminder_log")
      .select("id")
      .eq("kind", "platnosc")
      .eq("reference_id", payment.id)
      .maybeSingle();
    if (already) continue;

    const parents = await getParentEmails(admin, payment.student_id);
    if (parents.length === 0) continue;

    const studentName = payment.students?.full_name ?? "uczeń";
    const html = `
      <p>Przypomnienie o zaległej płatności.</p>
      <p><strong>Uczeń:</strong> ${studentName}<br/>
      <strong>Opis:</strong> ${payment.description}<br/>
      <strong>Kwota:</strong> ${formatAmount(payment.amount)}<br/>
      <strong>Termin:</strong> ${formatDate(payment.due_date)}</p>
    `;

    for (const parent of parents) {
      try {
        await sendEmail({
          to: parent.email,
          subject: `Przypomnienie o płatności — ${payment.description}`,
          html,
        });
      } catch {
        result.errors.push(`Płatność ${payment.id}: błąd wysyłki do ${parent.email}`);
      }
    }

    await admin.from("reminder_log").insert({ kind: "platnosc", reference_id: payment.id });
    result.payments++;
  }

  return result;
}

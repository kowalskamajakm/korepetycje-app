import { Clock, Wallet, CalendarRange } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { FinanceCharts } from "@/app/(app)/finanse/charts";

function toDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00Z");
}
function fromDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function mondayOf(dateStr: string) {
  const d = toDate(dateStr);
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return fromDate(d);
}
function addDays(dateStr: string, days: number) {
  const d = toDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return fromDate(d);
}
function monthKey(dateStr: string) {
  return dateStr.slice(0, 7);
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("pl-PL", { month: "short", year: "2-digit" }).format(
    new Date(Date.UTC(y, m - 1, 1))
  );
}
function formatAmount(amount: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(amount);
}

export default async function FinancePage() {
  await requireAdmin();

  const supabase = await createClient();

  const today = new Date().toISOString().slice(0, 10);
  const weekStart = mondayOf(today);
  const weekEnd = addDays(weekStart, 6);
  const monthStart = today.slice(0, 8) + "01";

  const twelveMonthsAgo = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 11);
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  })();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("lesson_date, duration_minutes, status")
    .neq("status", "odwolana")
    .gte("lesson_date", twelveMonthsAgo);

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, paid_at, status")
    .eq("status", "oplacone")
    .not("paid_at", "is", null)
    .gte("paid_at", twelveMonthsAgo);

  const allLessons = lessons ?? [];
  const allPayments = payments ?? [];

  const hoursThisWeek =
    allLessons
      .filter((l) => l.lesson_date >= weekStart && l.lesson_date <= weekEnd)
      .reduce((sum, l) => sum + l.duration_minutes, 0) / 60;

  const hoursThisMonth =
    allLessons
      .filter((l) => l.lesson_date >= monthStart)
      .reduce((sum, l) => sum + l.duration_minutes, 0) / 60;

  const incomeThisMonth = allPayments
    .filter((p) => p.paid_at!.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const monthKeys: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    monthKeys.push(d.toISOString().slice(0, 7));
  }

  const hoursByMonth = monthKeys.map((key) => ({
    month: monthLabel(key),
    godziny:
      Math.round(
        (allLessons
          .filter((l) => monthKey(l.lesson_date) === key)
          .reduce((sum, l) => sum + l.duration_minutes, 0) /
          60) *
          10
      ) / 10,
  }));

  const incomeByMonth = monthKeys.map((key) => ({
    month: monthLabel(key),
    dochod: allPayments
      .filter((p) => p.paid_at!.slice(0, 7) === key)
      .reduce((sum, p) => sum + Number(p.amount), 0),
  }));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Finanse</h1>
      <p className="mb-8 text-sm text-slate-500">
        Przegląd godzin i dochodów z ostatnich 12 miesięcy.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {hoursThisWeek.toFixed(1)} h
          </p>
          <p className="text-sm text-slate-500">Godziny w tym tygodniu</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <CalendarRange className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {hoursThisMonth.toFixed(1)} h
          </p>
          <p className="text-sm text-slate-500">Godziny w tym miesiącu</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Wallet className="h-4.5 w-4.5" />
          </div>
          <p className="text-2xl font-semibold text-slate-900">
            {formatAmount(incomeThisMonth)}
          </p>
          <p className="text-sm text-slate-500">Dochód w tym miesiącu</p>
        </div>
      </div>

      <FinanceCharts hoursByMonth={hoursByMonth} incomeByMonth={incomeByMonth} />
    </div>
  );
}

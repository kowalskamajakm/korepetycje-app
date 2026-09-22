import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { deletePayment, togglePaymentStatus } from "@/app/actions/payments";
import type { Payment } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr + "T00:00:00"));
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(amount);
}

export default async function PaymentsPage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: payments } = (await supabase
    .from("payments")
    .select(
      "id, student_id, description, amount, due_date, status, paid_at, students(id, full_name)"
    )
    .order("due_date")) as { data: Payment[] | null };

  const overdue = (payments ?? []).filter(
    (p) => p.status === "nieoplacone" && p.due_date < today
  );
  const upcoming = (payments ?? []).filter(
    (p) => p.status === "nieoplacone" && p.due_date >= today
  );
  const paid = (payments ?? []).filter((p) => p.status === "oplacone");

  const renderRow = (payment: Payment) => (
    <li
      key={payment.id}
      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-slate-900">
          {payment.students?.full_name ?? "—"}
        </span>
        <span className="text-slate-600">{payment.description}</span>
        <span className="font-medium text-slate-900">
          {formatAmount(payment.amount)}
        </span>
        <span className="text-slate-400">
          termin: {formatDate(payment.due_date)}
        </span>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-3">
          <form
            action={togglePaymentStatus.bind(
              null,
              payment.id,
              payment.status !== "oplacone"
            )}
          >
            <button
              type="submit"
              className={`rounded-lg px-2 py-1 text-xs font-medium ${
                payment.status === "oplacone"
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {payment.status === "oplacone"
                ? "Oznacz jako nieopłacone"
                : "Oznacz jako opłacone"}
            </button>
          </form>
          <Link
            href={`/platnosci/${payment.id}`}
            className="text-slate-600 hover:text-slate-900"
          >
            Edytuj
          </Link>
          <form action={deletePayment.bind(null, payment.id)}>
            <button type="submit" className="text-red-600 hover:text-red-800">
              Usuń
            </button>
          </form>
        </div>
      )}
    </li>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Płatności</h1>
        {isAdmin && (
          <Link
            href="/platnosci/nowa"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            + Dodaj płatność
          </Link>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-2 text-sm font-medium text-red-600">
            Zaległe ({overdue.length})
          </h2>
          {overdue.length === 0 ? (
            <p className="text-sm text-slate-500">Brak zaległych płatności.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-red-200 bg-white">
              <ul className="divide-y divide-red-100">
                {overdue.map(renderRow)}
              </ul>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-700">
            Do zapłaty ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">Brak nadchodzących płatności.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <ul className="divide-y divide-slate-100">
                {upcoming.map(renderRow)}
              </ul>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500">
            Opłacone ({paid.length})
          </h2>
          {paid.length === 0 ? (
            <p className="text-sm text-slate-500">Brak opłaconych pozycji.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white opacity-75">
              <ul className="divide-y divide-slate-100">{paid.map(renderRow)}</ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

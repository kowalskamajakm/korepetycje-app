import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { updatePayment } from "@/app/actions/payments";
import { PaymentForm } from "../payment-form";
import type { Payment } from "@/lib/types";

export default async function EditPaymentPage(
  props: PageProps<"/platnosci/[id]">
) {
  await requireAdmin();
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: payment } = (await supabase
    .from("payments")
    .select(
      "id, student_id, description, amount, due_date, status, paid_at, students(id, full_name)"
    )
    .eq("id", id)
    .single()) as { data: Payment | null };

  if (!payment) {
    notFound();
  }

  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  const updatePaymentWithId = updatePayment.bind(null, payment.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Edytuj płatność
      </h1>
      <PaymentForm
        action={updatePaymentWithId}
        students={students ?? []}
        payment={payment}
        submitLabel="Zapisz zmiany"
      />
    </div>
  );
}

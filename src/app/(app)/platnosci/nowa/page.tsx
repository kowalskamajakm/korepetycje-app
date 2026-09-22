import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { addPayment } from "@/app/actions/payments";
import { PaymentForm } from "@/app/(app)/platnosci/payment-form";

export default async function NewPaymentPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name")
    .order("full_name");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Dodaj płatność
      </h1>
      <PaymentForm
        action={addPayment}
        students={students ?? []}
        submitLabel="Dodaj płatność"
      />
    </div>
  );
}

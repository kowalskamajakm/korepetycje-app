"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type PaymentFormState = { error?: string } | undefined;

function readPaymentFields(formData: FormData) {
  return {
    student_id: String(formData.get("student_id") ?? ""),
    description: String(formData.get("description") ?? "").trim(),
    amount: Number(formData.get("amount") ?? 0),
    due_date: String(formData.get("due_date") ?? ""),
  };
}

export async function addPayment(
  _prevState: PaymentFormState,
  formData: FormData
) {
  const admin = await requireAdmin();
  const fields = readPaymentFields(formData);

  if (!fields.student_id || !fields.description || !fields.due_date) {
    return { error: "Wypełnij ucznia, opis i termin płatności." };
  }
  if (!(fields.amount > 0)) {
    return { error: "Podaj poprawną kwotę." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .insert({ ...fields, created_by: admin.id });

  if (error) {
    return { error: "Nie udało się dodać płatności. Spróbuj ponownie." };
  }

  revalidatePath("/platnosci");
  redirect("/platnosci");
}

export async function updatePayment(
  paymentId: string,
  _prevState: PaymentFormState,
  formData: FormData
) {
  await requireAdmin();
  const fields = readPaymentFields(formData);

  if (!fields.student_id || !fields.description || !fields.due_date) {
    return { error: "Wypełnij ucznia, opis i termin płatności." };
  }
  if (!(fields.amount > 0)) {
    return { error: "Podaj poprawną kwotę." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update(fields)
    .eq("id", paymentId);

  if (error) {
    return { error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidatePath("/platnosci");
  redirect("/platnosci");
}

export async function deletePayment(paymentId: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.from("payments").delete().eq("id", paymentId);

  revalidatePath("/platnosci");
}

export async function togglePaymentStatus(
  paymentId: string,
  markPaid: boolean
) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase
    .from("payments")
    .update({
      status: markPaid ? "oplacone" : "nieoplacone",
      paid_at: markPaid ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", paymentId);

  revalidatePath("/platnosci");
}

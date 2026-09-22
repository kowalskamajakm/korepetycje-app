"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type MaterialFormState = { error?: string } | undefined;

const MAX_SIZE = 20 * 1024 * 1024;

export async function addMaterial(
  _prevState: MaterialFormState,
  formData: FormData
) {
  const admin = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const studentId = String(formData.get("student_id") ?? "") || null;
  const file = formData.get("file");

  if (!title || !(file instanceof File) || file.size === 0) {
    return { error: "Podaj tytuł i wybierz plik." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Plik jest za duży (maksymalnie 20 MB)." };
  }

  const supabase = await createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("materials")
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return { error: "Nie udało się wgrać pliku. Spróbuj ponownie." };
  }

  const { error: insertError } = await supabase.from("materials").insert({
    title,
    file_path: path,
    file_size: file.size,
    student_id: studentId,
    uploaded_by: admin.id,
  });

  if (insertError) {
    await supabase.storage.from("materials").remove([path]);
    return { error: "Nie udało się zapisać materiału. Spróbuj ponownie." };
  }

  revalidatePath("/materialy");
  redirect("/materialy");
}

export async function deleteMaterial(materialId: string, filePath: string) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase.storage.from("materials").remove([filePath]);
  await supabase.from("materials").delete().eq("id", materialId);

  revalidatePath("/materialy");
}

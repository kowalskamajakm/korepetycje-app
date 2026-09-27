"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type HomeworkFormState = { error?: string } | undefined;

const MAX_SIZE = 20 * 1024 * 1024;

function readHomeworkFields(formData: FormData) {
  return {
    student_id: String(formData.get("student_id") ?? ""),
    description: String(formData.get("description") ?? "").trim(),
    due_date: String(formData.get("due_date") ?? "") || null,
  };
}

async function uploadAttachment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File
) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${randomUUID()}-${safeName}`;

  const { error } = await supabase.storage
    .from("materials")
    .upload(path, file, { contentType: file.type || undefined });

  if (error) return { error: "Nie udało się wgrać załącznika. Spróbuj ponownie." };

  return { path, size: file.size };
}

export async function addHomework(
  _prevState: HomeworkFormState,
  formData: FormData
) {
  const admin = await requireAdmin();
  const fields = readHomeworkFields(formData);

  if (!fields.student_id || !fields.description) {
    return { error: "Wybierz ucznia i opisz zadanie." };
  }

  const supabase = await createClient();

  let attachment: { path?: string; size?: number } = {};
  const file = formData.get("attachment");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_SIZE) {
      return { error: "Załącznik jest za duży (maksymalnie 20 MB)." };
    }
    const result = await uploadAttachment(supabase, file);
    if ("error" in result) return { error: result.error };
    attachment = { path: result.path, size: result.size };
  }

  const { error } = await supabase.from("homework").insert({
    ...fields,
    created_by: admin.id,
    attachment_path: attachment.path ?? null,
    attachment_size: attachment.size ?? null,
  });

  if (error) {
    if (attachment.path) await supabase.storage.from("materials").remove([attachment.path]);
    return { error: "Nie udało się dodać zadania. Spróbuj ponownie." };
  }

  revalidatePath("/prace-domowe");
  redirect("/prace-domowe");
}

export async function updateHomework(
  homeworkId: string,
  _prevState: HomeworkFormState,
  formData: FormData
) {
  await requireAdmin();
  const fields = readHomeworkFields(formData);

  if (!fields.student_id || !fields.description) {
    return { error: "Wybierz ucznia i opisz zadanie." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("homework")
    .select("attachment_path")
    .eq("id", homeworkId)
    .single();

  const removeExisting = formData.get("remove_attachment") === "on";
  const file = formData.get("attachment");

  const update: Record<string, unknown> = { ...fields };

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_SIZE) {
      return { error: "Załącznik jest za duży (maksymalnie 20 MB)." };
    }
    const result = await uploadAttachment(supabase, file);
    if ("error" in result) return { error: result.error };
    if (existing?.attachment_path) {
      await supabase.storage.from("materials").remove([existing.attachment_path]);
    }
    update.attachment_path = result.path;
    update.attachment_size = result.size;
  } else if (removeExisting && existing?.attachment_path) {
    await supabase.storage.from("materials").remove([existing.attachment_path]);
    update.attachment_path = null;
    update.attachment_size = null;
  }

  const { error } = await supabase
    .from("homework")
    .update(update)
    .eq("id", homeworkId);

  if (error) {
    return { error: "Nie udało się zapisać zmian. Spróbuj ponownie." };
  }

  revalidatePath("/prace-domowe");
  redirect("/prace-domowe");
}

export async function deleteHomework(homeworkId: string) {
  await requireAdmin();

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("homework")
    .select("attachment_path")
    .eq("id", homeworkId)
    .single();

  if (existing?.attachment_path) {
    await supabase.storage.from("materials").remove([existing.attachment_path]);
  }

  await supabase.from("homework").delete().eq("id", homeworkId);

  revalidatePath("/prace-domowe");
}

export async function toggleHomeworkStatus(
  homeworkId: string,
  markDone: boolean
) {
  await requireAdmin();

  const supabase = await createClient();
  await supabase
    .from("homework")
    .update({ status: markDone ? "zrobione" : "do_zrobienia" })
    .eq("id", homeworkId);

  revalidatePath("/prace-domowe");
}

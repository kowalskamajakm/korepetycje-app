"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { runReminders, type ReminderResult } from "@/lib/reminders";

export type SendRemindersState = (ReminderResult & { done: true }) | undefined;

export async function sendRemindersNow(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: SendRemindersState
): Promise<SendRemindersState> {
  await requireAdmin();
  const result = await runReminders();
  return { ...result, done: true };
}

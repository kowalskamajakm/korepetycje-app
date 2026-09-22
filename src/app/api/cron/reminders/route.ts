import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await runReminders();
  return NextResponse.json(result);
}

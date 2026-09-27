import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { deleteHomework, toggleHomeworkStatus } from "@/app/actions/homework";
import type { Homework } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
  }).format(new Date(dateStr + "T00:00:00"));
}

export default async function HomeworkPage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const supabase = await createClient();

  const { data: homework } = (await supabase
    .from("homework")
    .select(
      "id, student_id, description, due_date, status, attachment_path, attachment_size, students(id, full_name)"
    )
    .order("due_date", { nullsFirst: false })) as { data: Homework[] | null };

  const withUrls = await Promise.all(
    (homework ?? []).map(async (h) => {
      if (!h.attachment_path) return { ...h, viewUrl: null, downloadUrl: null };
      const [viewRes, downloadRes] = await Promise.all([
        supabase.storage.from("materials").createSignedUrl(h.attachment_path, 60 * 60),
        supabase.storage
          .from("materials")
          .createSignedUrl(h.attachment_path, 60 * 60, { download: true }),
      ]);
      return {
        ...h,
        viewUrl: viewRes.data?.signedUrl ?? null,
        downloadUrl: downloadRes.data?.signedUrl ?? null,
      };
    })
  );

  const todo = withUrls.filter((h) => h.status === "do_zrobienia");
  const done = withUrls.filter((h) => h.status === "zrobione");

  const renderRow = (item: (typeof withUrls)[number]) => (
    <li
      key={item.id}
      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-slate-900">
          {item.students?.full_name ?? "—"}
        </span>
        <span className="text-slate-600">{item.description}</span>
        {item.due_date && (
          <span className="text-slate-400">termin: {formatDate(item.due_date)}</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {item.viewUrl && (
          <a
            href={item.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Otwórz
          </a>
        )}
        {item.downloadUrl && (
          <a
            href={item.downloadUrl}
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Pobierz
          </a>
        )}
        {isAdmin && (
          <>
            <form
              action={toggleHomeworkStatus.bind(
                null,
                item.id,
                item.status !== "zrobione"
              )}
            >
              <button
                type="submit"
                className={`rounded-lg px-2 py-1 text-xs font-medium ${
                item.status === "zrobione"
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {item.status === "zrobione" ? "Cofnij" : "Oznacz jako zrobione"}
            </button>
          </form>
          <Link
            href={`/prace-domowe/${item.id}`}
            className="text-slate-600 hover:text-slate-900"
          >
            Edytuj
          </Link>
          <form action={deleteHomework.bind(null, item.id)}>
            <button type="submit" className="text-red-600 hover:text-red-800">
              Usuń
            </button>
          </form>
          </>
        )}
      </div>
    </li>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Prace domowe</h1>
        {isAdmin && (
          <Link
            href="/prace-domowe/nowa"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            + Dodaj zadanie
          </Link>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-700">
            Do zrobienia ({todo.length})
          </h2>
          {todo.length === 0 ? (
            <p className="text-sm text-slate-500">Brak zaległych zadań.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
              <ul className="divide-y divide-slate-100">{todo.map(renderRow)}</ul>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-500">
            Zrobione ({done.length})
          </h2>
          {done.length === 0 ? (
            <p className="text-sm text-slate-500">Brak zrobionych zadań.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface opacity-75">
              <ul className="divide-y divide-slate-100">{done.map(renderRow)}</ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

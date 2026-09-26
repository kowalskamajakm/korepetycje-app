import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { deleteMaterial } from "@/app/actions/materials";
import type { Material } from "@/lib/types";

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default async function MaterialsPage() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  const supabase = await createClient();

  const { data: materials } = (await supabase
    .from("materials")
    .select("id, title, file_path, file_size, student_id, created_at, students(id, full_name)")
    .order("created_at", { ascending: false })) as { data: Material[] | null };

  const withUrls = await Promise.all(
    (materials ?? []).map(async (m) => {
      const [viewRes, downloadRes] = await Promise.all([
        supabase.storage.from("materials").createSignedUrl(m.file_path, 60 * 60),
        supabase.storage
          .from("materials")
          .createSignedUrl(m.file_path, 60 * 60, { download: true }),
      ]);
      return {
        ...m,
        viewUrl: viewRes.data?.signedUrl ?? null,
        downloadUrl: downloadRes.data?.signedUrl ?? null,
      };
    })
  );

  const general = withUrls.filter((m) => !m.student_id);
  const perStudent = withUrls.filter((m) => m.student_id);

  const renderRow = (m: (typeof withUrls)[number]) => (
    <li
      key={m.id}
      className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-slate-900">{m.title}</span>
        {m.students?.full_name && (
          <span className="text-slate-500">({m.students.full_name})</span>
        )}
        <span className="text-slate-400">{formatSize(m.file_size)}</span>
      </div>
      <div className="flex items-center gap-3">
        {m.viewUrl && (
          <a
            href={m.viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Otwórz
          </a>
        )}
        {m.downloadUrl && (
          <a
            href={m.downloadUrl}
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Pobierz
          </a>
        )}
        {isAdmin && (
          <form action={deleteMaterial.bind(null, m.id, m.file_path)}>
            <button type="submit" className="text-red-600 hover:text-red-800">
              Usuń
            </button>
          </form>
        )}
      </div>
    </li>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Materiały</h1>
        {isAdmin && (
          <Link
            href="/materialy/nowy"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            + Dodaj materiał
          </Link>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-700">
            Ogólnodostępne ({general.length})
          </h2>
          {general.length === 0 ? (
            <p className="text-sm text-slate-500">Brak materiałów ogólnych.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
              <ul className="divide-y divide-slate-100">{general.map(renderRow)}</ul>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-slate-700">
            Dla konkretnych uczniów ({perStudent.length})
          </h2>
          {perStudent.length === 0 ? (
            <p className="text-sm text-slate-500">Brak przypisanych materiałów.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-surface">
              <ul className="divide-y divide-slate-100">{perStudent.map(renderRow)}</ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

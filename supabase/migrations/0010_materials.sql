-- Materialy / e-booki: plik w Supabase Storage + wpis w bazie.
-- student_id = null oznacza material ogolnodostepny (widoczny dla wszystkich rodzicow).

insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_path text not null,
  file_size bigint,
  student_id uuid references public.students (id) on delete cascade,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.materials enable row level security;

grant select, insert, update, delete on public.materials to authenticated;
grant select, insert, update, delete on public.materials to service_role;

create policy "Admin zarzadza materialami"
  on public.materials for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Rodzic widzi materialy swoich uczniow i ogolne"
  on public.materials for select
  using (
    student_id is null
    or exists (
      select 1 from public.parent_students ps
      where ps.student_id = materials.student_id and ps.parent_id = auth.uid()
    )
  );

-- Uprawnienia do plikow w Storage (osobna tabela storage.objects).
create policy "Admin zarzadza plikami materialow"
  on storage.objects for all
  using (bucket_id = 'materials' and public.is_admin())
  with check (bucket_id = 'materials' and public.is_admin());

create policy "Rodzic pobiera pliki materialow"
  on storage.objects for select
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.materials m
      where m.file_path = storage.objects.name
        and (
          m.student_id is null
          or exists (
            select 1 from public.parent_students ps
            where ps.student_id = m.student_id and ps.parent_id = auth.uid()
          )
        )
    )
  );

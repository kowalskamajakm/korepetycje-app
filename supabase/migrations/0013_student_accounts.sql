-- Konto logowania bezposrednio dla ucznia (obok kont rodzicow).
-- Jeden uczen moze miec co najwyzej jedno wlasne konto (linked_user_id).

alter table public.students add column if not exists linked_user_id uuid references public.profiles (id);
create unique index if not exists students_linked_user_id_idx on public.students (linked_user_id);

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'parent', 'student'));

-- Rozszerzenie polityk "select" o dostep ucznia do wlasnych danych.

drop policy if exists "Rodzic widzi lekcje swoich uczniow" on public.lessons;
create policy "Rodzic i uczen widza lekcje swojego ucznia"
  on public.lessons for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = lessons.student_id and ps.parent_id = auth.uid()
    )
    or exists (
      select 1 from public.students s
      where s.id = lessons.student_id and s.linked_user_id = auth.uid()
    )
  );

drop policy if exists "Rodzic widzi platnosci swoich uczniow" on public.payments;
create policy "Rodzic i uczen widza platnosci swojego ucznia"
  on public.payments for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = payments.student_id and ps.parent_id = auth.uid()
    )
    or exists (
      select 1 from public.students s
      where s.id = payments.student_id and s.linked_user_id = auth.uid()
    )
  );

drop policy if exists "Rodzic widzi prace domowe swoich uczniow" on public.homework;
create policy "Rodzic i uczen widza prace domowe swojego ucznia"
  on public.homework for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = homework.student_id and ps.parent_id = auth.uid()
    )
    or exists (
      select 1 from public.students s
      where s.id = homework.student_id and s.linked_user_id = auth.uid()
    )
  );

drop policy if exists "Rodzic widzi materialy swoich uczniow i ogolne" on public.materials;
create policy "Rodzic i uczen widza materialy swojego ucznia i ogolne"
  on public.materials for select
  using (
    student_id is null
    or exists (
      select 1 from public.parent_students ps
      where ps.student_id = materials.student_id and ps.parent_id = auth.uid()
    )
    or exists (
      select 1 from public.students s
      where s.id = materials.student_id and s.linked_user_id = auth.uid()
    )
  );

drop policy if exists "Rodzic pobiera pliki materialow" on storage.objects;
create policy "Rodzic i uczen pobieraja pliki materialow"
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
          or exists (
            select 1 from public.students s
            where s.id = m.student_id and s.linked_user_id = auth.uid()
          )
        )
    )
  );

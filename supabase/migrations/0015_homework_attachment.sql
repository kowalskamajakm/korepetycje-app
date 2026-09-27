-- Zalacznik do pracy domowej (plik trzymany w tym samym buckecie co materialy).

alter table public.homework add column if not exists attachment_path text;
alter table public.homework add column if not exists attachment_size bigint;

create policy "Rodzic i uczen pobieraja zalaczniki prac domowych"
  on storage.objects for select
  using (
    bucket_id = 'materials'
    and exists (
      select 1 from public.homework h
      where h.attachment_path = storage.objects.name
        and (
          exists (
            select 1 from public.parent_students ps
            where ps.student_id = h.student_id and ps.parent_id = auth.uid()
          )
          or exists (
            select 1 from public.students s
            where s.id = h.student_id and s.linked_user_id = auth.uid()
          )
        )
    )
  );

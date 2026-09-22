-- Prace domowe przypisane do uczniow.

create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  description text not null,
  due_date date,
  status text not null default 'do_zrobienia'
    check (status in ('do_zrobienia', 'zrobione')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.homework enable row level security;

grant select, insert, update, delete on public.homework to authenticated;
grant select, insert, update, delete on public.homework to service_role;

create policy "Admin zarzadza pracami domowymi"
  on public.homework for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Rodzic widzi prace domowe swoich uczniow"
  on public.homework for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = homework.student_id and ps.parent_id = auth.uid()
    )
  );

create index if not exists homework_due_date_idx on public.homework (due_date);

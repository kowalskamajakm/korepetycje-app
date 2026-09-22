-- Lekcje. Data i godzina jako osobne kolumny (bez stref czasowych) -
-- upraszcza to obsluge, bo caly system dziala w jednej strefie (Polska).

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  lesson_date date not null,
  start_time time not null,
  duration_minutes int not null default 60,
  status text not null default 'zaplanowana'
    check (status in ('zaplanowana', 'odbyta', 'odwolana')),
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;

grant select, insert, update, delete on public.lessons to authenticated;
grant select, insert, update, delete on public.lessons to service_role;

create policy "Admin zarzadza lekcjami"
  on public.lessons for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Rodzic widzi lekcje swoich uczniow"
  on public.lessons for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = lessons.student_id and ps.parent_id = auth.uid()
    )
  );

create index if not exists lessons_date_idx on public.lessons (lesson_date, start_time);

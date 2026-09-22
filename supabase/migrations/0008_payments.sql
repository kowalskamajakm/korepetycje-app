-- Platnosci: recznie oznaczane oplacone/nieoplacone, powiazane z uczniem.

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  description text not null,
  amount numeric(10, 2) not null,
  due_date date not null,
  status text not null default 'nieoplacone'
    check (status in ('nieoplacone', 'oplacone')),
  paid_at date,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

grant select, insert, update, delete on public.payments to authenticated;
grant select, insert, update, delete on public.payments to service_role;

create policy "Admin zarzadza platnosciami"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Rodzic widzi platnosci swoich uczniow"
  on public.payments for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = payments.student_id and ps.parent_id = auth.uid()
    )
  );

create index if not exists payments_due_date_idx on public.payments (due_date);

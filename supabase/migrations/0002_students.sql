-- Uczniowie oraz powiazanie uczen <-> konto rodzica (wiele do wielu).
-- Uruchom w Supabase: SQL Editor -> New query -> wklej i "Run".

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  subject text,
  level text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.parent_students (
  parent_id uuid not null references public.profiles (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  primary key (parent_id, student_id)
);

alter table public.students enable row level security;
alter table public.parent_students enable row level security;

-- Wymagane, bo "Automatically expose new tables" jest wylaczone w projekcie.
grant select, insert, update, delete on public.students to authenticated;
grant select, insert, update, delete on public.students to service_role;
grant select, insert, update, delete on public.parent_students to authenticated;
grant select, insert, update, delete on public.parent_students to service_role;

-- Admin ma pelny dostep do uczniow.
create policy "Admin zarzadza uczniami"
  on public.students for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Rodzic widzi tylko przypisanych sobie uczniow.
create policy "Rodzic widzi swoich uczniow"
  on public.students for select
  using (
    exists (
      select 1 from public.parent_students ps
      where ps.student_id = students.id and ps.parent_id = auth.uid()
    )
  );

-- Admin zarzadza powiazaniami rodzic-uczen.
create policy "Admin zarzadza powiazaniami"
  on public.parent_students for all
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  )
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Rodzic widzi wlasne powiazania (przydatne do ustalenia, ktory uczen jest jego).
create policy "Rodzic widzi wlasne powiazania"
  on public.parent_students for select
  using (parent_id = auth.uid());

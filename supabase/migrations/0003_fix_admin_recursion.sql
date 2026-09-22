-- Naprawa: polityki RLS sprawdzajace "czy admin" odpytywaly tabele profiles
-- z wnetrza polityki na tej samej tabeli, co powodowalo nieskonczona rekursje
-- (blad 42P17 "infinite recursion detected in policy for relation profiles").
-- Rozwiazanie: funkcja SECURITY DEFINER, ktora omija RLS przy sprawdzaniu roli.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
drop policy if exists "Admin widzi wszystkie profile" on public.profiles;
create policy "Admin widzi wszystkie profile"
  on public.profiles for select
  using (public.is_admin());

-- students
drop policy if exists "Admin zarzadza uczniami" on public.students;
create policy "Admin zarzadza uczniami"
  on public.students for all
  using (public.is_admin())
  with check (public.is_admin());

-- parent_students
drop policy if exists "Admin zarzadza powiazaniami" on public.parent_students;
create policy "Admin zarzadza powiazaniami"
  on public.parent_students for all
  using (public.is_admin())
  with check (public.is_admin());

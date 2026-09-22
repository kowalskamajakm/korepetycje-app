-- Role uzytkownikow: admin (korepetytorka) i parent (rodzic ucznia).
-- Uruchom ten plik w Supabase: SQL Editor -> New query -> wklej i "Run".

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'parent' check (role in ('admin', 'parent')),
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Wymagane, bo "Automatically expose new tables" jest wylaczone w projekcie.
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

create policy "Uzytkownik widzi wlasny profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin widzi wszystkie profile"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Automatyczne tworzenie profilu (rola domyslna: parent) przy rejestracji nowego konta.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

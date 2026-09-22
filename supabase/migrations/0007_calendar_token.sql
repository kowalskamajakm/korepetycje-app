-- Prywatny token do subskrypcji kalendarza (link .ics do iPhone/Kalendarz).
-- Dwuetapowo, zeby kazdy istniejacy wiersz dostal INNY losowy token
-- (a nie jedna wspolna wartosc default).

alter table public.profiles add column if not exists calendar_token uuid;

update public.profiles
set calendar_token = gen_random_uuid()
where calendar_token is null;

alter table public.profiles alter column calendar_token set default gen_random_uuid();
alter table public.profiles alter column calendar_token set not null;

create unique index if not exists profiles_calendar_token_idx
  on public.profiles (calendar_token);

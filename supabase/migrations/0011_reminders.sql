-- Link do spotkania (Teams) przy uczniu + log wyslanych przypomnien
-- (zeby nigdy nie wyslac tego samego przypomnienia dwa razy).

alter table public.students add column if not exists teams_link text;

create table if not exists public.reminder_log (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('lekcja', 'platnosc')),
  reference_id uuid not null,
  sent_at timestamptz not null default now(),
  unique (kind, reference_id)
);

alter table public.reminder_log enable row level security;

grant select, insert on public.reminder_log to authenticated;

create policy "Admin widzi log przypomnien"
  on public.reminder_log for select
  using (public.is_admin());

create policy "Admin dodaje wpisy do logu przypomnien"
  on public.reminder_log for insert
  with check (public.is_admin());

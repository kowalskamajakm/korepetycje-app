-- Poniewaz "Automatically expose new tables" jest wylaczone (bezpieczniejsza
-- opcja), same polityki RLS nie wystarcza - Postgres wymaga tez jawnego
-- nadania uprawnien na poziomie tabeli dla roli "authenticated".
-- RLS i tak dalej ogranicza dostep do konkretnych wierszy.

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.students to authenticated;
grant select, insert, update, delete on public.parent_students to authenticated;

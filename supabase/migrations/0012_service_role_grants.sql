-- Rola "service_role" (uzywana przez zadania systemowe: wysylke przypomnien
-- i eksport kalendarza .ics) omija RLS, ale - tak jak "authenticated" -
-- nadal potrzebuje zwyklych uprawnien GRANT na poziomie tabeli, bo
-- "Automatically expose new tables" jest wylaczone w tym projekcie.
-- Bez tego kazde zapytanie z service_role konczylo sie "permission denied".

grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.students to service_role;
grant select, insert, update, delete on public.parent_students to service_role;
grant select, insert, update, delete on public.lessons to service_role;
grant select, insert, update, delete on public.payments to service_role;
grant select, insert, update, delete on public.homework to service_role;
grant select, insert, update, delete on public.materials to service_role;
grant select, insert, update, delete on public.reminder_log to service_role;

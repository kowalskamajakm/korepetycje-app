import { requireAdmin } from "@/lib/supabase/require-admin";
import { SendRemindersButton } from "@/app/(app)/przypomnienia/send-button";

export default async function RemindersPage() {
  await requireAdmin();

  return (
    <div className="max-w-lg">
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">
        Przypomnienia mailowe
      </h1>
      <p className="mb-6 text-sm text-slate-500">
        Wysyła mail o lekcji zaplanowanej na jutro (z linkiem do Teams, jeśli
        jest ustawiony przy uczniu) oraz o płatnościach, które są już
        przeterminowane. Każde przypomnienie wysyłane jest tylko raz.
      </p>

      <div className="mb-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Dopóki aplikacja działa tylko na tym komputerze, przypomnienia trzeba
        wysyłać ręcznie tym przyciskiem. Po opublikowaniu aplikacji w
        internecie będą wysyłane automatycznie, raz dziennie.
      </div>

      <div className="mb-6 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
        Bez zweryfikowanej domeny w Resend maile trafiają tylko na Twój
        własny, zweryfikowany adres e-mail — do testów podepnij go jako
        rodzica przy testowym uczniu.
      </div>

      <SendRemindersButton />
    </div>
  );
}

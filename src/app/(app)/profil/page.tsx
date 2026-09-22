import { getCurrentProfile } from "@/lib/supabase/profile";
import { PasswordForm } from "@/app/(app)/profil/password-form";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">Twoje konto</h1>
      <p className="mb-8 text-sm text-slate-500">{profile?.email}</p>

      <h2 className="mb-3 text-lg font-medium text-slate-900">Zmień hasło</h2>
      <PasswordForm />
    </div>
  );
}

import { getCurrentProfile } from "@/lib/supabase/profile";
import { Sidebar } from "@/app/(app)/sidebar";
import { MobileNav } from "@/app/(app)/mobile-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-screen bg-slate-50 md:h-screen">
      <Sidebar profile={profile} />
      <div className="flex min-h-screen flex-1 flex-col overflow-y-auto md:h-screen">
        <MobileNav profile={profile} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

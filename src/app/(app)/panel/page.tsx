import Link from "next/link";
import { CalendarDays, Wallet } from "lucide-react";
import { getCurrentProfile } from "@/lib/supabase/profile";

const quickLinks = [
  { title: "Grafik", description: "Zobacz nadchodzące lekcje.", href: "/grafik", icon: CalendarDays },
  { title: "Płatności", description: "Sprawdź status płatności.", href: "/platnosci", icon: Wallet },
];

export default async function PanelHomePage() {
  const profile = await getCurrentProfile();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-slate-900">
        Witaj{profile?.full_name ? `, ${profile.full_name}` : ""}!
      </h1>
      <p className="mb-8 text-sm text-slate-500">Co chcesz dziś sprawdzić?</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-xl">
        {quickLinks.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm transition hover:-translate-y-0.5 hover:border-accent-soft hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-indigo-600 group-hover:text-white">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="mb-1 text-lg font-medium text-slate-900">{item.title}</h2>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

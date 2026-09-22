"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, UserRound, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { navItems } from "@/app/(app)/nav-items";
import type { Profile } from "@/lib/supabase/profile";

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <Link href="/panel" className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-sm font-semibold text-slate-900">Panel korepetytora</span>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <Link
          href="/profil"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
            pathname === "/profil"
              ? "bg-indigo-50 text-indigo-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <UserRound className="h-4 w-4" />
          <span className="truncate">{profile?.full_name || profile?.email}</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="mt-0.5 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Wyloguj
          </button>
        </form>
      </div>
    </aside>
  );
}

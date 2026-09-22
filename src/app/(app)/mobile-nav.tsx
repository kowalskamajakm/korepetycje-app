"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, UserRound, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { navItems } from "@/app/(app)/nav-items";
import type { Profile } from "@/lib/supabase/profile";

export function MobileNav({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex flex-col border-b border-slate-200 bg-white md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/panel" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Panel korepetytora</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/profil" className="rounded-lg p-2 text-slate-500 hover:bg-slate-50">
            <UserRound className="h-4 w-4" />
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-lg p-2 text-slate-500 hover:bg-slate-50">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </div>
  );
}

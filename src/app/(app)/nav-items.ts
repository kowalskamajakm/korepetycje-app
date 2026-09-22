import {
  Users,
  CalendarDays,
  Wallet,
  BookOpen,
  FolderOpen,
  Bell,
  LineChart,
} from "lucide-react";

export const navItems = [
  { href: "/uczniowie", label: "Uczniowie", icon: Users, adminOnly: true },
  { href: "/grafik", label: "Grafik", icon: CalendarDays, adminOnly: false },
  { href: "/platnosci", label: "Płatności", icon: Wallet, adminOnly: false },
  { href: "/prace-domowe", label: "Prace domowe", icon: BookOpen, adminOnly: false },
  { href: "/materialy", label: "Materiały", icon: FolderOpen, adminOnly: false },
  { href: "/finanse", label: "Finanse", icon: LineChart, adminOnly: true },
  { href: "/przypomnienia", label: "Przypomnienia", icon: Bell, adminOnly: true },
];

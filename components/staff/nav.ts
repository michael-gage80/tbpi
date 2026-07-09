import {
  LayoutDashboard,
  BarChart3,
  ListChecks,
  Calendar,
  Megaphone,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/firebase/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/ops", label: "Overview", icon: LayoutDashboard },
  { href: "/ops/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ops/tasks", label: "Tasks", icon: ListChecks },
  { href: "/ops/calendar", label: "Calendar", icon: Calendar },
  { href: "/ops/announcements", label: "Announcements", icon: Megaphone },
  { href: "/ops/admin", label: "Admin", icon: Shield, adminOnly: true },
];

export function visibleNav(role: Role): NavItem[] {
  return NAV_ITEMS.filter((i) => !i.adminOnly || role === "admin");
}

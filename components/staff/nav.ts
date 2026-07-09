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
  { href: "/staff", label: "Overview", icon: LayoutDashboard },
  { href: "/staff/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/staff/tasks", label: "Tasks", icon: ListChecks },
  { href: "/staff/calendar", label: "Calendar", icon: Calendar },
  { href: "/staff/announcements", label: "Announcements", icon: Megaphone },
  { href: "/staff/admin", label: "Admin", icon: Shield, adminOnly: true },
];

export function visibleNav(role: Role): NavItem[] {
  return NAV_ITEMS.filter((i) => !i.adminOnly || role === "admin");
}

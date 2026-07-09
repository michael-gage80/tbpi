import {
  Home,
  Mail,
  Calendar,
  ListChecks,
  Activity,
  Megaphone,
  Shield,
  User,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/firebase/types";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  /** Shown in the mobile bottom tab bar (max 5). */
  primary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/ops", label: "Home", icon: Home, primary: true },
  { href: "/ops/email", label: "Email", icon: Mail, adminOnly: true, primary: true },
  { href: "/ops/calendar", label: "Calendar", icon: Calendar, primary: true },
  { href: "/ops/tasks", label: "Tasks", icon: ListChecks, primary: true },
  { href: "/ops/analytics", label: "Status", icon: Activity, primary: true },
  { href: "/ops/announcements", label: "Announcements", icon: Megaphone },
  { href: "/ops/admin", label: "Admin", icon: Shield, adminOnly: true },
  { href: "/ops/profile", label: "Profile", icon: User },
];

export function visibleNav(role: Role): NavItem[] {
  return NAV_ITEMS.filter((i) => !i.adminOnly || role === "admin");
}

export function primaryNav(role: Role): NavItem[] {
  return visibleNav(role).filter((i) => i.primary).slice(0, 5);
}

export function secondaryNav(role: Role): NavItem[] {
  return visibleNav(role).filter((i) => !i.primary);
}

export function isNavActive(pathname: string, href: string): boolean {
  return href === "/ops" ? pathname === "/ops" : pathname.startsWith(href);
}

"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Coffee, Users, FolderOpen, LayoutDashboard } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/staff/theme-toggle";
import { BrandLogo } from "@/components/staff/brand-logo";
import { initials, displayName } from "@/components/staff/dashboard-shell";
import { logout } from "@/components/staff/api";
import { useMyProfile } from "@/components/staff/profile/use-profiles";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { Session } from "@/lib/firebase/types";

interface RoomNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ROOM_NAV: RoomNavItem[] = [
  { href: "/room", label: "Home", icon: Coffee },
  { href: "/room/directory", label: "Directory", icon: Users },
  { href: "/room/resources", label: "Resources", icon: FolderOpen },
];

function isRoomActive(pathname: string, href: string): boolean {
  return href === "/room" ? pathname === "/room" : pathname.startsWith(href);
}

function useLogout() {
  const router = useRouter();
  return async () => {
    try {
      await logout();
      await signOut(auth);
    } finally {
      router.replace("/login");
    }
  };
}

function NavRow({ item, pathname }: { item: RoomNavItem; pathname: string }) {
  const active = isRoomActive(pathname, item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-200",
        active
          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
          : "font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-transform group-hover:scale-110",
          active && "text-sidebar-accent-foreground"
        )}
      />
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

function DesktopSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const handleLogout = useLogout();
  const { profile } = useMyProfile();

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
      <div className="px-2 pt-2">
        <BrandLogo className="h-8" />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Staff Room
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {ROOM_NAV.map((item) => (
          <NavRow key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Cross-link back to Operations */}
      <nav className="flex flex-col gap-1 border-t border-sidebar-border pt-3">
        <Link
          href="/ops"
          className="group flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <LayoutDashboard className="size-[18px] shrink-0 transition-transform group-hover:scale-110" />
          <span className="flex-1">Operations</span>
        </Link>
      </nav>

      {/* Profile card */}
      <div className="rounded-[18px] bg-card p-3 shadow-card">
        <div className="flex items-center gap-3">
          <Link href="/ops/profile" className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="size-10">
              {profile?.photoURL && <AvatarImage src={profile.photoURL} alt="" />}
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {initials(session.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile?.displayName || displayName(session.email)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile?.title || session.role}
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
          <Link
            href="/ops/profile"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="size-3.5" />
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

function MobileBar({ session }: { session: Session }) {
  const pathname = usePathname();
  const handleLogout = useLogout();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <BrandLogo className="h-6" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Account">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials(session.email)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="truncate text-sm font-semibold">{displayName(session.email)}</p>
                <p className="truncate text-xs capitalize text-muted-foreground">{session.role}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/ops">
                  <LayoutDashboard className="size-4" /> Operations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="size-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Horizontal room nav (mobile) */}
      <nav className="flex items-center gap-1 overflow-x-auto px-3 pb-2">
        {ROOM_NAV.map((item) => {
          const active = isRoomActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function RoomShell({ session, children }: { session: Session; children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full overflow-x-clip">
      <DesktopSidebar session={session} />
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        <MobileBar session={session} />
        <main className="mx-auto w-full min-w-0 max-w-[1180px] flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}

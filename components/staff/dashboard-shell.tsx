"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, KeyRound } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/staff/theme-toggle";
import { BrandLogo } from "@/components/staff/brand-logo";
import { BootSplash } from "@/components/staff/boot-splash";
import { MobileTabBar } from "@/components/staff/mobile-tabbar";
import { CommandPalette } from "@/components/staff/command-palette";
import { visibleNav, isNavActive } from "@/components/staff/nav";
import { logout } from "@/components/staff/api";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/firebase/types";

export function initials(email: string): string {
  const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = local.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function displayName(email: string): string {
  const local = email.split("@")[0].replace(/[._-]+/g, " ");
  return local.replace(/\b\w/g, (c) => c.toUpperCase());
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

function DesktopSidebar({ session }: { session: Session }) {
  const pathname = usePathname();
  const handleLogout = useLogout();
  const items = visibleNav(session.role);

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
      <div className="px-2 pt-2">
        <BrandLogo className="h-8" />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Operations
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
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
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile card */}
      <div className="rounded-[18px] bg-card p-3 shadow-card">
        <div className="flex items-center gap-3">
          <Link href="/ops/profile" className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                {initials(session.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName(session.email)}
              </p>
              <p className="text-xs capitalize text-muted-foreground">{session.role}</p>
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

function MobileTopBar({ session }: { session: Session }) {
  const handleLogout = useLogout();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
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
              <Link href="/ops/profile">
                <KeyRound className="size-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function DashboardShell({ session, children }: { session: Session; children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <BootSplash />
      <CommandPalette role={session.role} />
      <DesktopSidebar session={session} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar session={session} />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          {children}
        </main>
      </div>
      <MobileTabBar role={session.role} />
    </div>
  );
}

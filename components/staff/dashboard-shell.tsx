"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/staff/theme-toggle";
import { ChangePasswordDialog } from "@/components/staff/change-password-dialog";
import { visibleNav } from "@/components/staff/nav";
import { logout } from "@/components/staff/api";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/firebase/types";

function initials(email: string): string {
  const local = email.split("@")[0].replace(/[._-]+/g, " ").trim();
  const parts = local.split(" ").filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function displayName(email: string): string {
  const local = email.split("@")[0].replace(/[._-]+/g, " ");
  return local.replace(/\b\w/g, (c) => c.toUpperCase());
}

function SidebarBody({ session, onNavigate }: { session: Session; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = visibleNav(session.role);

  async function handleLogout() {
    try {
      await logout();
      await signOut(auth);
    } finally {
      router.replace("/login");
    }
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      {/* Brand */}
      <div className="px-2 pt-2">
        <p className="text-lg font-normal" style={{ fontFamily: "var(--font-dm-serif)" }}>
          TBPI
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Operations
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = item.href === "/staff" ? pathname === "/staff" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                  : "font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon className={cn("size-[18px] shrink-0", active && "text-sidebar-accent-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile card */}
      <div className="rounded-[18px] border border-sidebar-border bg-background/40 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials(session.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {displayName(session.email)}
            </p>
            <p className="text-xs capitalize text-muted-foreground">{session.role}</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <ChangePasswordDialog />
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
    </div>
  );
}

export function DashboardShell({ session, children }: { session: Session; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarBody session={session} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-sidebar px-4 py-3 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Open menu" className="rounded-md p-1.5 hover:bg-accent/60">
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBody session={session} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <p className="text-base font-normal" style={{ fontFamily: "var(--font-dm-serif)" }}>
            TBPI <span className="text-primary">Operations</span>
          </p>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

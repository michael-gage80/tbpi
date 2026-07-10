"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { primaryNav, secondaryNav, isNavActive } from "@/components/staff/nav";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/firebase/types";

export function MobileTabBar({ role }: { role: Role }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const primary = primaryNav(role);
  const secondary = secondaryNav(role);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="ops-glass mx-auto flex max-w-md items-center justify-around rounded-full px-2 py-1.5 shadow-card">
        {primary.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        {secondary.length > 0 && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10px] font-medium text-muted-foreground">
                <MoreHorizontal className="size-5" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetTitle className="sr-only">More</SheetTitle>
              <div className="grid grid-cols-3 gap-3 py-4">
                {secondary.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl bg-chip/60 p-4 text-xs font-medium transition-colors",
                        active ? "text-primary" : "text-foreground"
                      )}
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}

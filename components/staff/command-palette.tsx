"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListChecks, Calendar, Megaphone, Home, Activity, Mail } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  useSharedTasks,
  useSharedEvents,
  useSharedAnnouncements,
} from "@/components/staff/firestore-hooks";
import type { Role } from "@/lib/firebase/types";

export const OPEN_COMMAND_EVENT = "tbpi:command";

/** Global ⌘K command palette. Rendered once in the shell. */
export function CommandPalette({ role }: { role: Role }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: tasks } = useSharedTasks();
  const { data: events } = useSharedEvents();
  const { data: announcements } = useSharedAnnouncements();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_EVENT, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_EVENT, onOpen);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const pages = [
    { label: "Home", href: "/ops", icon: Home },
    { label: "Status", href: "/ops/analytics", icon: Activity },
    { label: "Tasks", href: "/ops/tasks", icon: ListChecks },
    { label: "Calendar", href: "/ops/calendar", icon: Calendar },
    { label: "Announcements", href: "/ops/announcements", icon: Megaphone },
    ...(role === "admin" ? [{ label: "Email", href: "/ops/email", icon: Mail }] : []),
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search operations…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Go to">
          {pages.map((p) => (
            <CommandItem key={p.href} value={`page ${p.label}`} onSelect={() => go(p.href)}>
              <p.icon className="size-4 text-muted-foreground" />
              {p.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {tasks.length > 0 && (
          <CommandGroup heading="Tasks">
            {tasks.slice(0, 20).map((t) => (
              <CommandItem key={t.id} value={`task ${t.title}`} onSelect={() => go("/ops/tasks")}>
                <ListChecks className="size-4 text-muted-foreground" />
                <span className={t.done ? "line-through opacity-60" : ""}>{t.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {events.length > 0 && (
          <CommandGroup heading="Events">
            {events.slice(0, 20).map((e) => (
              <CommandItem key={e.id} value={`event ${e.title}`} onSelect={() => go("/ops/calendar")}>
                <Calendar className="size-4 text-muted-foreground" />
                {e.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {announcements.length > 0 && (
          <CommandGroup heading="Announcements">
            {announcements.slice(0, 20).map((a) => (
              <CommandItem
                key={a.id}
                value={`announcement ${a.title}`}
                onSelect={() => go("/ops/announcements")}
              >
                <Megaphone className="size-4 text-muted-foreground" />
                {a.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

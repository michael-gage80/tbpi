"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { Plus, ChevronLeft, ChevronRight, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { Chip } from "@/components/staff/ui/primitives";
import { EventDialog } from "@/components/staff/calendar/event-dialog";
import { useSharedEvents } from "@/components/staff/firestore-hooks";
import { eventsApi } from "@/components/staff/api";
import { cn } from "@/lib/utils";

const CATEGORY_BORDER: Record<string, string> = {
  event: "#E8581A",
  meeting: "var(--muted-foreground)",
  deadline: "#D8392B",
};

export function CalendarClient() {
  const { data, loading, error } = useSharedEvents();
  const [cursor, setCursor] = useState(new Date());

  const monthStart = startOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsOn = (day: Date) => data.filter((e) => isSameDay(new Date(e.start), day));
  // Captured once per mount; "upcoming" only needs coarse freshness.
  // eslint-disable-next-line react-hooks/purity
  const cutoff = Date.now() - 60 * 60 * 1000;
  const upcoming = data.filter((e) => e.end >= cutoff).slice(0, 8);

  async function remove(id: string) {
    try {
      await eventsApi.remove(id);
      toast.success("Event deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading title="Calendar" subtitle="Shared team events." />
        <EventDialog
          defaultDate={cursor}
          trigger={
            <Button size="sm">
              <Plus className="size-4" /> Add event
            </Button>
          }
        />
      </div>

      {loading ? (
        <Skeleton className="h-80 w-full" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">Couldn’t load calendar — {error}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Month grid */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-normal" style={{ fontFamily: "var(--font-dm-serif)" }}>
                {format(cursor, "MMMM yyyy")}
              </h2>
              <div className="flex gap-1">
                <button onClick={() => setCursor(subMonths(cursor, 1))} aria-label="Previous month" className="rounded-md p-1.5 hover:bg-accent/60">
                  <ChevronLeft className="size-4" />
                </button>
                <button onClick={() => setCursor(new Date())} className="rounded-md px-2 py-1 text-xs font-medium hover:bg-accent/60">
                  Today
                </button>
                <button onClick={() => setCursor(addMonths(cursor, 1))} aria-label="Next month" className="rounded-md p-1.5 hover:bg-accent/60">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const dayEvents = eventsOn(day);
                const today = isSameDay(day, new Date());
                return (
                  <EventDialog
                    key={day.toISOString()}
                    defaultDate={day}
                    trigger={
                      <button
                        className={cn(
                          "flex min-h-16 flex-col rounded-lg border border-transparent p-1 text-left transition-colors hover:border-border",
                          !isSameMonth(day, cursor) && "opacity-40"
                        )}
                      >
                        <span
                          className={cn(
                            "mb-0.5 inline-flex size-6 items-center justify-center rounded-full text-xs",
                            today && "bg-primary font-semibold text-primary-foreground"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        <span className="flex flex-col gap-0.5">
                          {dayEvents.slice(0, 2).map((e) => (
                            <span
                              key={e.id}
                              className="truncate rounded px-1 text-[10px] text-foreground"
                              style={{ borderLeft: `2px solid ${CATEGORY_BORDER[e.category ?? "event"]}` }}
                            >
                              {e.title}
                            </span>
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 2}</span>
                          )}
                        </span>
                      </button>
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Upcoming list */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Upcoming</p>
            {upcoming.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Nothing scheduled.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((e) => (
                  <li
                    key={e.id}
                    className="group rounded-xl border border-border bg-card p-3"
                    style={{ borderLeft: `4px solid ${CATEGORY_BORDER[e.category ?? "event"]}` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(e.start), e.allDay ? "EEE d MMM" : "EEE d MMM, HH:mm")}
                        </p>
                        {e.location && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3" /> {e.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {e.category && <Chip kind={e.category} />}
                        <button
                          onClick={() => remove(e.id)}
                          aria-label="Delete event"
                          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

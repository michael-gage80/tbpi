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
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { Stagger, Reveal } from "@/components/staff/ui/motion";
import { Chip } from "@/components/staff/ui/primitives";
import { EventDialog } from "@/components/staff/calendar/event-dialog";
import { useSharedEvents } from "@/components/staff/firestore-hooks";
import { eventsApi } from "@/components/staff/api";
import { cn } from "@/lib/utils";

const CATEGORY_COLOR: Record<string, string> = {
  event: "#E8581A",
  meeting: "var(--foreground)",
  deadline: "#D8392B",
};

export function CalendarClient() {
  const { data, loading, error } = useSharedEvents();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

  const gridStart = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsOn = (day: Date) =>
    data.filter((e) => isSameDay(new Date(e.start), day)).sort((a, b) => a.start - b.start);
  const dayEvents = eventsOn(selected);

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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-dm-serif)" }}>
            {format(cursor, "MMMM yyyy")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{format(selected, "EEEE, d MMMM")}</p>
        </div>
        <EventDialog
          defaultDate={selected}
          trigger={<Button size="sm"><Plus className="size-4" /> Add event</Button>}
        />
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-[20px] bg-card" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">Couldn’t load calendar — {error}</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          {/* Month grid */}
          <Reveal standalone>
            <SpotlightCard className="p-5" spotlight={false} tilt={false}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-1">
                  <button onClick={() => setCursor(subMonths(cursor, 1))} aria-label="Previous month" className="rounded-lg p-1.5 hover:bg-accent"><ChevronLeft className="size-4" /></button>
                  <button onClick={() => { setCursor(new Date()); setSelected(new Date()); }} className="rounded-lg px-2.5 py-1 text-xs font-medium hover:bg-accent">Today</button>
                  <button onClick={() => setCursor(addMonths(cursor, 1))} aria-label="Next month" className="rounded-lg p-1.5 hover:bg-accent"><ChevronRight className="size-4" /></button>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "#E8581A" }} /> Event</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-foreground" /> Meeting</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: "#D8392B" }} /> Deadline</span>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-muted-foreground">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i} className="py-1.5">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => {
                  const evs = eventsOn(day);
                  const today = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selected);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelected(day)}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors",
                        !isSameMonth(day, cursor) && "opacity-35",
                        isSelected && !today && "bg-accent",
                        !today && !isSelected && "hover:bg-accent/60"
                      )}
                    >
                      <span className={cn("flex size-7 items-center justify-center rounded-full", today && "bg-primary font-semibold text-primary-foreground")}>
                        {format(day, "d")}
                      </span>
                      <span className="mt-0.5 flex h-1.5 items-center gap-0.5">
                        {evs.slice(0, 3).map((e) => (
                          <span key={e.id} className="size-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLOR[e.category ?? "event"] }} />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Day schedule */}
          <Reveal standalone>
            <div>
              <h2 className="mb-3 text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
                {format(selected, "EEEE")}&apos;s schedule
              </h2>
              {dayEvents.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-line2 p-10 text-center text-sm text-muted-foreground">
                  Nothing scheduled.
                </div>
              ) : (
                <Stagger className="space-y-3">
                  {dayEvents.map((e) => (
                    <Reveal key={e.id}>
                      <div
                        className="group flex items-start gap-3 rounded-[18px] bg-card p-4 shadow-card"
                        style={{ borderLeft: `4px solid ${CATEGORY_COLOR[e.category ?? "event"]}` }}
                      >
                        <span className="w-12 shrink-0 pt-0.5 text-xs font-semibold text-muted-foreground">
                          {e.allDay ? "All day" : format(new Date(e.start), "HH:mm")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                          {e.location && <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {e.location}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {e.category && <Chip kind={e.category} />}
                          <button onClick={() => remove(e.id)} aria-label="Delete event" className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </Stagger>
              )}
            </div>
          </Reveal>
        </div>
      )}
    </div>
  );
}

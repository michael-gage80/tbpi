"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";
import { Panel } from "@/components/staff/analytics/detail-shell";
import { AnimatedNumber } from "@/components/staff/ui/motion";
import { VisitorGlobe, type GlobeMarker } from "./visitor-globe";
import { resolveCountry, codeToFlag } from "@/lib/geo/countries";
import type { AnalyticsRow } from "@/lib/firebase/types";

const MAX_MARKERS = 12;

export function GlobePanel({ countries }: { countries: AnalyticsRow[] }) {
  const { markers, rows, total, resolvedCount, top } = useMemo(() => {
    // Aggregate visitors by resolved country (Vercel may return code or name).
    const acc = new Map<string, { code: string; name: string; lat: number; lng: number; visitors: number }>();
    let unresolved = 0;
    for (const row of countries) {
      const c = resolveCountry(row.label);
      if (!c) {
        unresolved += row.value;
        continue;
      }
      const prev = acc.get(c.code);
      if (prev) prev.visitors += row.value;
      else acc.set(c.code, { code: c.code, name: c.name, lat: c.lat, lng: c.lng, visitors: row.value });
    }
    const sorted = [...acc.values()].sort((a, b) => b.visitors - a.visitors);
    const total = sorted.reduce((s, c) => s + c.visitors, 0) + unresolved;
    const denom = total || 1;

    const rows: GlobeMarker[] = sorted.map((c, i) => ({
      code: c.code,
      name: c.name,
      flag: codeToFlag(c.code),
      lat: c.lat,
      lng: c.lng,
      visitors: c.visitors,
      share: c.visitors / denom,
      rank: i + 1,
    }));
    return {
      rows,
      markers: rows.slice(0, MAX_MARKERS),
      total,
      resolvedCount: sorted.length,
      top: rows[0] ?? null,
    };
  }, [countries]);

  const [active, setActive] = useState<string | null>(null);
  const [focusSeq, setFocusSeq] = useState<{ code: string; seq: number } | null>(null);

  const select = (code: string) => setFocusSeq((f) => ({ code, seq: (f?.seq ?? 0) + 1 }));

  if (rows.length === 0) {
    return (
      <Panel title="Where visitors come from">
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
          <Globe2 className="size-8 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">No regional data yet — visitor countries will appear here as traffic builds.</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Where visitors come from">
      {/* Hero stat trio */}
      <div className="mb-5 flex flex-wrap gap-x-10 gap-y-3">
        <Stat label="Total visitors" value={<AnimatedNumber value={total} />} />
        <Stat label="Countries reached" value={<AnimatedNumber value={resolvedCount} />} />
        {top && (
          <Stat
            label="Top region"
            value={
              <span className="flex items-center gap-2">
                <span className="text-2xl leading-none">{top.flag}</span>
                <span>{top.name}</span>
              </span>
            }
          />
        )}
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Globe */}
        <div className="order-1">
          <VisitorGlobe markers={markers} active={active} onHover={setActive} onSelect={select} focusSeq={focusSeq} />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Drag to spin · hover or tap a marker</p>
        </div>

        {/* Synced ranked list */}
        <div className="order-2 max-h-[420px] space-y-1 overflow-y-auto pr-1">
          {rows.map((r) => {
            const isActive = active === r.code;
            const marked = r.rank <= MAX_MARKERS;
            return (
              <button
                key={r.code}
                onMouseEnter={() => marked && setActive(r.code)}
                onMouseLeave={() => setActive(null)}
                onClick={() => marked && select(r.code)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                  isActive ? "bg-primary/10" : "hover:bg-muted/60"
                } ${marked ? "" : "cursor-default"}`}
              >
                <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-muted-foreground">{r.rank}</span>
                <span className="text-base leading-none">{r.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{r.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{r.visitors.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--primary)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(3, r.share * 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{(r.share * 100).toFixed(1)}%</span>
              </button>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

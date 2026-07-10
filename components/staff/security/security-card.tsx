"use client";

import Link from "next/link";
import { ShieldCheck, ShieldAlert, ArrowUpRight, Check, X } from "lucide-react";
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { AnimatedNumber } from "@/components/staff/ui/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useSecurity } from "@/components/staff/security";
import { cn } from "@/lib/utils";

const SEV = [
  { key: "critical" as const, label: "Critical", color: "#D8392B" },
  { key: "high" as const, label: "High", color: "#E8581A" },
  { key: "medium" as const, label: "Medium", color: "#E8951A" },
  { key: "low" as const, label: "Low", color: "#8E8E93" },
];

export function SecurityCard() {
  const { summary: s, loading, error } = useSecurity();
  const critical = s.critical > 0;

  return (
    <Link href="/ops/analytics/security" className="block">
      <SpotlightCard
        className="p-5"
        onClick={() => {}}
        style={
          {
            boxShadow:
              s.tone === "red"
                ? "var(--shadow), 0 0 0 1px rgba(216,57,43,.25), 0 12px 40px -18px rgba(216,57,43,.5)"
                : s.tone === "amber"
                  ? "var(--shadow), 0 12px 40px -22px rgba(232,88,26,.4)"
                  : "var(--shadow), 0 12px 40px -22px rgba(34,197,94,.3)",
          } as React.CSSProperties
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {critical ? (
              <ShieldAlert className="size-5 text-[#D8392B] ops-anim" style={{ animation: "tbpiLed 1.6s ease-in-out infinite" }} />
            ) : (
              <ShieldCheck className="size-5" style={{ color: s.tone === "amber" ? "#E8581A" : "#22C55E" }} />
            )}
            <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
              Security
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{
                color: s.tone === "red" ? "#D8392B" : s.tone === "amber" ? "#E8581A" : "#1F9D55",
                backgroundColor:
                  s.tone === "red" ? "rgba(216,57,43,.14)" : s.tone === "amber" ? "rgba(232,88,26,.14)" : "rgba(34,197,94,.14)",
              }}
            >
              {s.grade}
            </span>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : error ? (
          <p className="text-xs text-muted-foreground">Security data unavailable.</p>
        ) : (
          <>
            {!critical && s.high === 0 ? (
              <p className="mb-4 text-sm font-medium" style={{ color: "#1F9D55" }}>
                Secure — no critical issues.
              </p>
            ) : (
              <p className="mb-4 text-sm font-medium text-foreground">
                <AnimatedNumber value={s.critical} className="font-bold text-[#D8392B]" /> critical ·{" "}
                {s.high} high open
              </p>
            )}

            <div className="grid grid-cols-4 gap-2">
              {SEV.map((sev) => (
                <div key={sev.key} className="rounded-xl bg-chip/60 p-2.5 text-center">
                  <p className="text-lg font-normal" style={{ fontFamily: "var(--font-dm-serif)", color: s[sev.key] > 0 ? sev.color : undefined }}>
                    {s[sev.key]}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{sev.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                {s.repos.map((r) => (
                  <span key={r.fullName} className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <span className={cn("size-1.5 rounded-full")} style={{ backgroundColor: r.critical ? "#D8392B" : r.high ? "#E8581A" : "#22C55E" }} />
                    {r.shortName}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                {s.ciFailing === 0 ? <Check className="size-3.5 text-[#1F9D55]" /> : <X className="size-3.5 text-[#D8392B]" />}
                CI
              </span>
            </div>
          </>
        )}
      </SpotlightCard>
    </Link>
  );
}

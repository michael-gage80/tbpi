"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/staff/ui/spotlight-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Chip } from "@/components/staff/ui/primitives";
import { mail, ZOHO_NOT_CONNECTED } from "@/components/staff/email/mail-api";
import type { EmailThread } from "@/lib/firebase/types";

const triageKind: Record<string, string> = { needsReply: "needsReply", fyi: "fyi", waitingOn: "waiting" };
const initials = (n: string) => {
  const p = n.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
};

export function InboxCard() {
  const [threads, setThreads] = useState<EmailThread[] | null>(null);
  const [error, setError] = useState(false);
  const [notConnected, setNotConnected] = useState(false);

  useEffect(() => {
    mail
      .list("inbox")
      .then((t) => setThreads(t.slice(0, 4)))
      .catch((err) => {
        if (err instanceof Error && err.message === ZOHO_NOT_CONNECTED) setNotConnected(true);
        else setError(true);
      });
  }, []);

  return (
    <SpotlightCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Inbox
        </h2>
        <Link href="/ops/email" className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-transform hover:translate-x-0.5">
          Open inbox <ArrowRight className="size-3.5" />
        </Link>
      </div>
      {notConnected ? (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">Your Zoho mailbox isn’t connected.</p>
          <Link href="/ops/profile" className="mt-1 inline-block text-xs font-semibold text-primary hover:underline">
            Connect in Profile
          </Link>
        </div>
      ) : error ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Couldn’t load mail.</p>
      ) : threads === null ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : threads.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Inbox zero. 🎉</p>
      ) : (
        <ul>
          {threads.map((t) => (
            <li key={t.id}>
              <Link href="/ops/email" className="flex items-start gap-3 border-b border-line py-3 last:border-0">
                <Avatar className="size-8 shrink-0"><AvatarFallback className="bg-chip text-xs font-semibold">{initials(t.sender.name)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={t.unread ? "truncate text-sm font-bold text-foreground" : "truncate text-sm font-semibold text-foreground"}>{t.sender.name}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{format(new Date(t.date), "HH:mm")}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{t.subject}</p>
                </div>
                {t.triage && <Chip kind={triageKind[t.triage] ?? "fyi"} className="mt-0.5" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SpotlightCard>
  );
}

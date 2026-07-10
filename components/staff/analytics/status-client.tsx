"use client";

import { Stagger, Reveal } from "@/components/staff/ui/motion";
import { StatusPill } from "@/components/staff/ui/primitives";
import { SectionLabel } from "@/components/staff/ui/page-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import { fetchSystemStatus } from "@/lib/org/callables";
import {
  WebsiteCard,
  SearchCard,
  GithubCard,
  LinkedInCard,
  ZohoCard,
} from "@/components/staff/analytics/cards";

function HealthPill() {
  const { data, loading, error } = useAsync(fetchSystemStatus);
  if (loading) return <Skeleton className="h-7 w-40 rounded-full" />;
  const healthy =
    !error &&
    !!data &&
    (data.zoho?.operational ?? true) &&
    (data.repos ?? []).every((r) => r.checksPass) &&
    (data.vercel ?? []).every((v) => v.state === "ready");
  return (
    <StatusPill tone={error ? "amber" : healthy ? "green" : "amber"}>
      {error ? "Status unavailable" : healthy ? "All systems operational" : "Some systems need attention"}
    </StatusPill>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function StatusClient() {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-normal text-foreground sm:text-4xl" style={{ fontFamily: "var(--font-dm-serif)" }}>
          System Status
        </h1>
        <HealthPill />
      </div>

      <Stagger className="space-y-8">
        <Reveal>
          <Group label="Web & Search">
            <WebsiteCard />
            <SearchCard />
          </Group>
        </Reveal>
        <Reveal>
          <Group label="Code">
            <GithubCard />
          </Group>
        </Reveal>
        <Reveal>
          <Group label="Social & Mail">
            <LinkedInCard />
            <ZohoCard />
          </Group>
        </Reveal>
      </Stagger>
    </div>
  );
}

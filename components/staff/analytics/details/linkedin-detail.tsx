"use client";

import { format } from "date-fns";
import { ExternalLink, Heart, MessageCircle } from "lucide-react";
import { Stagger, Reveal, AnimatedNumber } from "@/components/staff/ui/motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/components/staff/use-async";
import { fetchLinkedInSnapshot } from "@/lib/org/callables";
import { DetailShell, Panel, HeroNumber } from "@/components/staff/analytics/detail-shell";
import { RadialGauge } from "@/components/staff/analytics/viz";

export function LinkedInDetail() {
  const { data, loading, error } = useAsync(fetchLinkedInSnapshot);
  const a = data?.analytics;
  const none = data && data.source === "none";
  const post = data?.latestPost;

  return (
    <DetailShell eyebrow="LinkedIn" title="Social">
      {loading ? (
        <Skeleton className="h-48 w-full rounded-[20px]" />
      ) : error ? (
        <Panel><p className="text-sm text-muted-foreground">LinkedIn data unavailable.</p></Panel>
      ) : none || !a ? (
        <Panel><p className="text-sm text-muted-foreground">Analytics not connected yet (Community Management API pending).</p></Panel>
      ) : (
        <Stagger className="space-y-4">
          <Reveal>
            <Panel>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <HeroNumber label="Followers" value={<AnimatedNumber value={a.followers ?? 0} />} />
                <HeroNumber label="Gain 30d" value={<AnimatedNumber value={a.followerGain30d ?? 0} />} />
                <HeroNumber label="Impressions 30d" value={<AnimatedNumber value={a.impressions30d ?? 0} />} />
                <HeroNumber label="Views 30d" value={<AnimatedNumber value={a.pageViews30d ?? 0} />} />
              </div>
            </Panel>
          </Reveal>
          <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
            <Reveal><Panel title="Engagement"><div className="flex justify-center py-2"><RadialGauge value={a.engagementRate != null ? +(a.engagementRate * 100).toFixed(1) : null} max={10} unit="%" label="Engagement rate" tone="#3B82F6" /></div></Panel></Reveal>
            {post && (
              <Reveal><Panel title="Latest post">
                <p className="text-sm text-foreground">{post.text}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  {post.likes != null && <span className="flex items-center gap-1"><Heart className="size-3.5" /> {post.likes}</span>}
                  {post.comments != null && <span className="flex items-center gap-1"><MessageCircle className="size-3.5" /> {post.comments}</span>}
                  {post.publishedAt && <span>{format(new Date(post.publishedAt), "d MMM")}</span>}
                  {post.url && <a href={post.url} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 font-semibold text-primary">Open <ExternalLink className="size-3.5" /></a>}
                </div>
              </Panel></Reveal>
            )}
          </div>
        </Stagger>
      )}
    </DetailShell>
  );
}

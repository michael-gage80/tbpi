"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Paperclip, LinkIcon, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionLabel } from "@/components/staff/ui/page-heading";
import {
  submissionsApi,
  CATEGORY_META,
  CATEGORY_ORDER,
  formatFileSize,
} from "@/components/staff/room/resources-api";
import type { ResourceCategory, RoomSubmission } from "@/lib/firebase/types";

function SubmissionRow({
  submission,
  onReviewed,
}: {
  submission: RoomSubmission;
  onReviewed: () => void;
}) {
  const [category, setCategory] = useState<ResourceCategory>(submission.suggestedCategory ?? "links");
  const [busy, setBusy] = useState(false);
  const Icon = submission.kind === "file" ? Paperclip : LinkIcon;

  async function review(action: "approve" | "reject") {
    setBusy(true);
    try {
      await submissionsApi.review({ id: submission.id, action, category });
      toast.success(action === "approve" ? "Published to the hub." : "Submission dismissed.");
      onReviewed();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update submission.");
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{submission.title}</p>
          {submission.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{submission.description}</p>
          )}
          <p className="mt-1 text-[11px] text-muted-foreground">
            {submission.submittedByName || submission.submittedByEmail}
            {submission.createdAt ? ` · ${formatDistanceToNow(submission.createdAt, { addSuffix: true })}` : ""}
            {submission.kind === "file" && submission.fileSize ? ` · ${formatFileSize(submission.fileSize)}` : ""}
          </p>
          <a
            href={submission.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
          >
            {submission.kind === "file" ? "Preview file" : "Open link"}
          </a>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <Select value={category} onValueChange={(v) => setCategory(v as ResourceCategory)}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_ORDER.map((c) => (
              <SelectItem key={c} value={c}>
                {CATEGORY_META[c].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => review("reject")}>
          <X className="size-4" /> Dismiss
        </Button>
        <Button size="sm" disabled={busy} onClick={() => review("approve")}>
          <Check className="size-4" /> Publish
        </Button>
      </div>
    </div>
  );
}

export function ReviewQueue({
  submissions,
  onReviewed,
}: {
  submissions: RoomSubmission[];
  onReviewed: () => void;
}) {
  if (submissions.length === 0) return null;

  return (
    <section className="mb-10 rounded-[20px] border border-primary/20 bg-primary/[0.04] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Inbox className="size-4 text-primary" />
        <SectionLabel>Pending submissions · {submissions.length}</SectionLabel>
      </div>
      <div className="grid gap-3">
        {submissions.map((s) => (
          <SubmissionRow key={s.id} submission={s} onReviewed={onReviewed} />
        ))}
      </div>
    </section>
  );
}

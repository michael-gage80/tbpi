"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Upload,
  Download,
  ExternalLink,
  FileText,
  LinkIcon,
  Pencil,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, SectionLabel } from "@/components/staff/ui/page-heading";
import { ResourceDialog } from "@/components/staff/room/resource-dialog";
import { SubmitDialog } from "@/components/staff/room/submit-dialog";
import { ReviewQueue } from "@/components/staff/room/review-queue";
import {
  resourcesApi,
  submissionsApi,
  CATEGORY_META,
  CATEGORY_ORDER,
  formatFileSize,
} from "@/components/staff/room/resources-api";
import type { RoomResource, RoomSubmission } from "@/lib/firebase/types";

function linkHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

function ResourceCard({
  resource,
  isAdmin,
  onChanged,
}: {
  resource: RoomResource;
  isAdmin: boolean;
  onChanged: () => void;
}) {
  const isFile = resource.kind === "file";
  const Icon = isFile ? FileText : LinkIcon;

  async function remove() {
    if (!window.confirm(`Delete “${resource.title}”? This can't be undone.`)) return;
    try {
      await resourcesApi.remove(resource.id);
      toast.success("Resource removed.");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{resource.title}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {isFile
              ? `${(resource.fileName ?? "File")}${resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ""}`
              : linkHost(resource.url)}
          </p>
        </div>
      </div>

      {resource.description && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {resource.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <a
          href={resource.url}
          target={isFile ? undefined : "_blank"}
          rel="noopener noreferrer"
          download={isFile ? resource.fileName ?? true : undefined}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          {isFile ? <Download className="size-4" /> : <ExternalLink className="size-4" />}
          {isFile ? "Download" : "Open"}
        </a>

        {isAdmin && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <ResourceDialog
              resource={resource}
              onSaved={onChanged}
              trigger={
                <button
                  type="button"
                  aria-label="Edit resource"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
              }
            />
            <button
              type="button"
              aria-label="Delete resource"
              onClick={remove}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResourcesClient({ isAdmin }: { isAdmin: boolean }) {
  const [resources, setResources] = useState<RoomResource[]>([]);
  const [submissions, setSubmissions] = useState<RoomSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [res, subs] = await Promise.all([
        resourcesApi.list(),
        isAdmin ? submissionsApi.list().catch(() => []) : Promise.resolve([] as RoomSubmission[]),
      ]);
      setResources(res);
      setSubmissions(subs);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: resources.filter((r) => r.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <PageHeading title="Resources" subtitle="Brand assets, templates, policies and tools — curated for the team." />
        <div className="flex items-center gap-2">
          <SubmitDialog
            trigger={
              <Button variant="outline">
                <Upload className="size-4" /> Submit a resource
              </Button>
            }
          />
          {isAdmin && (
            <ResourceDialog
              onSaved={load}
              trigger={
                <Button>
                  <Plus className="size-4" /> Add resource
                </Button>
              }
            />
          )}
        </div>
      </div>

      {isAdmin && <ReviewQueue submissions={submissions} onReviewed={load} />}

      {loading ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Loading resources…</p>
      ) : grouped.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border py-16 text-center">
          <FolderOpen className="mx-auto mb-3 size-8 text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">No resources yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin ? "Add the first one, or approve a submission." : "Check back soon, or submit one for the team."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ cat, items }) => (
            <section key={cat}>
              <SectionLabel>
                {CATEGORY_META[cat].label} · {items.length}
              </SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (
                  <ResourceCard key={r.id} resource={r} isAdmin={isAdmin} onChanged={load} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { ChangePasswordDialog } from "@/components/staff/change-password-dialog";
import { CalmToggle } from "@/components/staff/calm-toggle";
import { AvatarCropDialog } from "@/components/staff/profile/avatar-crop-dialog";
import { ZohoMailbox } from "@/components/staff/profile/zoho-mailbox";
import { useMyProfile, refreshRoster } from "@/components/staff/profile/use-profiles";
import type { Session } from "@/lib/firebase/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-card p-6 shadow-card">
      <h2 className="mb-4 text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>{title}</h2>
      {children}
    </div>
  );
}

const initials = (s: string) => {
  const p = s.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
};

export function ProfileClient({ session }: { session: Session }) {
  const { profile, loading, refresh } = useMyProfile();
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setTitle(profile.title);
      setBio(profile.bio);
    }
  }, [profile]);

  async function saveFields() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, title, bio }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Save failed.");
      await refresh();
      refreshRoster();
      toast.success("Profile saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(String(reader.result));
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onCropped(base64: string) {
    setUploading(true);
    try {
      const res = await fetch("/api/profile/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, contentType: "image/jpeg" }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Upload failed.");
      await refresh();
      refreshRoster();
      toast.success("Photo updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeading title="Profile" subtitle="Your details, visible to the team." />

      {loading ? (
        <Skeleton className="h-40 w-full rounded-[20px]" />
      ) : (
        <Section title="You">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <Avatar className="size-24">
                {profile?.photoURL && <AvatarImage src={profile.photoURL} alt={displayName} />}
                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">{initials(displayName || session.email)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-card transition-transform hover:scale-105"
                aria-label="Change photo"
              >
                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
            </div>
            <div className="grid flex-1 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-name">Display name</Label>
                <Input id="p-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-title">Title</Label>
                <Input id="p-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. COO" />
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="p-bio">Bio</Label>
            <Textarea id="p-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="A short bio…" />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={saveFields} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          </div>
        </Section>
      )}

      <Section title="Account">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd className="text-foreground">{session.email}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Role</dt><dd className="capitalize text-foreground">{session.role}</dd></div>
        </dl>
      </Section>

      {session.role === "admin" && (
        <Section title="Zoho mailbox">
          <Suspense fallback={<Skeleton className="h-16 w-full rounded-xl" />}>
            <ZohoMailbox />
          </Suspense>
        </Section>
      )}

      <Section title="Preferences">
        <CalmToggle />
      </Section>

      <Section title="Security">
        <ChangePasswordDialog />
      </Section>

      <AvatarCropDialog src={cropSrc} open={cropOpen} onOpenChange={setCropOpen} onCropped={onCropped} />
    </div>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileByEmail } from "@/components/staff/profile/use-profiles";
import { cn } from "@/lib/utils";

function initials(name: string, email?: string): string {
  const base = name?.trim() || (email ?? "").split("@")[0].replace(/[._-]+/g, " ");
  const p = base.split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

/** Avatar that resolves a photo from the shared roster by email, else initials. */
export function AvatarFor({
  email,
  name,
  className,
}: {
  email?: string | null;
  name?: string;
  className?: string;
}) {
  const profile = useProfileByEmail(email);
  const display = profile?.displayName || name || email || "";
  return (
    <Avatar className={cn("size-9", className)}>
      {profile?.photoURL && <AvatarImage src={profile.photoURL} alt={display} />}
      <AvatarFallback className="bg-chip text-xs font-semibold">{initials(display, email ?? undefined)}</AvatarFallback>
    </Avatar>
  );
}

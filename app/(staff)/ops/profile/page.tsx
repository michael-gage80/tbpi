import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { PageHeading } from "@/components/staff/ui/page-heading";
import { ChangePasswordDialog } from "@/components/staff/change-password-dialog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function displayName(email: string): string {
  const local = email.split("@")[0].replace(/[._-]+/g, " ");
  return local.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="max-w-2xl">
      <PageHeading title="Profile" subtitle="Your account details." />
      <div className="space-y-4 rounded-[20px] bg-card p-6 shadow-card">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Name</p>
          <p className="text-foreground">{displayName(session.email)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Email</p>
          <p className="text-foreground">{session.email}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Role</p>
          <p className="capitalize text-foreground">{session.role}</p>
        </div>
        <div className="pt-2">
          <ChangePasswordDialog />
        </div>
        <p className="text-xs text-muted-foreground">
          Editable photo, title and bio arrive in the next release.
        </p>
      </div>
    </div>
  );
}

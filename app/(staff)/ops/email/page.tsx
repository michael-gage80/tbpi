import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { PageHeading } from "@/components/staff/ui/page-heading";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EmailPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/ops");

  return (
    <div>
      <PageHeading title="Email" subtitle="Your TBPI inbox." />
      <div className="flex flex-col items-center justify-center rounded-[20px] bg-card p-16 text-center shadow-card">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="size-6 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">Inbox coming next</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          The full admin email client (folders, reading, compose, attachments) lands in the next
          release.
        </p>
      </div>
    </div>
  );
}

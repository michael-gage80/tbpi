import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { EmailClient } from "@/components/staff/email/email-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function EmailPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/ops");

  return <EmailClient />;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Mail, Plug, Unplug } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Led } from "@/components/staff/ui/primitives";
import { mail, type ZohoConnection } from "@/components/staff/email/mail-api";

/**
 * Admin-only: connect / disconnect this admin's own Zoho mailbox via OAuth.
 * Connect kicks off the server OAuth flow (redirect to Zoho consent); the
 * function callback redirects back to /ops/profile?zoho=connected|error.
 */
export function ZohoMailbox() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<ZohoConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStatus(await mail.connectionStatus());
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Handle the OAuth return, then strip the query param.
  useEffect(() => {
    const outcome = params.get("zoho");
    if (!outcome) return;
    if (outcome === "connected") {
      toast.success("Zoho mailbox connected.");
      void refresh();
    } else if (outcome === "error") {
      toast.error("Couldn't connect your Zoho mailbox. Please try again.");
    }
    router.replace("/ops/profile");
  }, [params, router, refresh]);

  async function connect() {
    setBusy(true);
    try {
      const { url } = await mail.connectStart();
      window.location.assign(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start the connection.");
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!window.confirm("Disconnect your Zoho mailbox? You'll need to reconnect to read or send mail.")) return;
    setBusy(true);
    try {
      await mail.disconnect();
      toast.success("Zoho mailbox disconnected.");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Disconnect failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Skeleton className="h-16 w-full rounded-xl" />;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-4" />
        </span>
        <div className="min-w-0">
          {status?.connected ? (
            <>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Led tone="green" /> Connected as {status.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {status.connectedAt
                  ? `Linked ${format(new Date(status.connectedAt), "d MMM yyyy")}`
                  : "Your mail is read and sent from your own Zoho account."}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">Not connected</p>
              <p className="text-xs text-muted-foreground">
                Connect your Zoho account to read and send your own mail in the dashboard.
              </p>
            </>
          )}
        </div>
      </div>

      {status?.connected ? (
        <Button variant="outline" onClick={disconnect} disabled={busy} className="shrink-0">
          {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Unplug className="mr-2 size-4" />}
          Disconnect
        </Button>
      ) : (
        <Button onClick={connect} disabled={busy} className="shrink-0">
          {busy ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plug className="mr-2 size-4" />}
          Connect Zoho
        </Button>
      )}
    </div>
  );
}

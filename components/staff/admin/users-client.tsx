"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, ShieldOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface UserRow {
  uid: string;
  email: string;
  role: string | null;
  lastSignIn: string | null;
  disabled: boolean;
}

const initials = (email: string) => {
  const l = email.split("@")[0].replace(/[._-]+/g, " ").trim().split(" ");
  return ((l[0]?.[0] ?? "") + (l[1]?.[0] ?? "")).toUpperCase() || "?";
};

async function api(method: string, body?: unknown) {
  const res = await fetch("/api/admin/users", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

function InviteDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [busy, setBusy] = useState(false);
  const [temp, setTemp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api("POST", { email: email.trim(), role });
      onDone();
      if (res.tempPassword) {
        setTemp(res.tempPassword);
        toast.success("User provisioned.");
      } else {
        toast.success("Role assigned to existing user.");
        setOpen(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invite failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setTemp(null); setEmail(""); setRole("staff"); } }}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus className="size-4" /> Invite</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Invite staff member</DialogTitle></DialogHeader>
        {temp ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Share this temporary password securely. They should change it after first sign-in.</p>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-chip p-3 font-mono text-sm">
              <span className="truncate">{temp}</span>
              <button onClick={() => { navigator.clipboard.writeText(temp); setCopied(true); }} aria-label="Copy">
                {copied ? <Check className="size-4 text-[#1F9D55]" /> : <Copy className="size-4" />}
              </button>
            </div>
            <DialogFooter><Button onClick={() => setOpen(false)}>Done</Button></DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Email</Label>
              <Input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@theblackpolicyinstitute.org" required />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Provisioning…" : "Provision"}</Button></DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function UsersClient({ selfUid }: { selfUid: string }) {
  const [users, setUsers] = useState<UserRow[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api("GET");
      setUsers(data.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn’t load users.");
      setUsers([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function changeRole(uid: string, role: string) {
    try {
      await api("PATCH", { uid, role });
      toast.success("Role updated.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
  }

  async function revoke(uid: string, email: string) {
    if (!confirm(`Revoke access for ${email}? Their sessions end immediately.`)) return;
    try {
      await api("DELETE", { uid });
      toast.success("Access revoked.");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Revoke failed.");
    }
  }

  return (
    <div className="rounded-[20px] bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-normal text-foreground" style={{ fontFamily: "var(--font-dm-serif)" }}>Team</h2>
        <InviteDialog onDone={load} />
      </div>
      {users === null ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : users.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No users yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.uid} className="flex flex-wrap items-center gap-3 py-3">
              <Avatar className="size-9"><AvatarFallback className="bg-chip text-xs font-semibold">{initials(u.email)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{u.email}</p>
                <p className="text-xs text-muted-foreground">
                  {u.role ? `${u.role}` : "no access"}
                  {u.lastSignIn ? ` · seen ${formatDistanceToNow(new Date(u.lastSignIn), { addSuffix: true })}` : " · never signed in"}
                </p>
              </div>
              <Select value={u.role ?? "none"} onValueChange={(v) => changeRole(u.uid, v)} disabled={!u.role}>
                <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  {!u.role && <SelectItem value="none" disabled>No access</SelectItem>}
                </SelectContent>
              </Select>
              {u.uid !== selfUid && u.role && (
                <button onClick={() => revoke(u.uid, u.email)} aria-label="Revoke" className="rounded-lg p-2 text-muted-foreground hover:text-destructive">
                  <ShieldOff className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, ShieldOff, Copy, Check, Eye, EyeOff, RefreshCw } from "lucide-react";
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
  name: string | null;
  role: string | null;
  lastSignIn: string | null;
  disabled: boolean;
}

const initials = (name: string, email: string) => {
  const src = name?.trim() || email.split("@")[0].replace(/[._-]+/g, " ").trim();
  const l = src.split(/\s+/);
  return ((l[0]?.[0] ?? "") + (l[1]?.[0] ?? "")).toUpperCase() || "?";
};

/** A strong, human-typeable password for the admin to hand over. */
function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

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

const ORG_DOMAIN = "@theblackpolicyinstitute.org";

function AddMemberDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState("staff");
  const [busy, setBusy] = useState(false);
  const [temp, setTemp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function reset() {
    setName(""); setEmail(""); setPassword(""); setShowPw(false);
    setRole("staff"); setTemp(null); setCopied(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password && password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await api("POST", {
        displayName: name.trim(),
        email: email.trim(),
        password: password || undefined,
        role,
      });
      onDone();
      if (res.tempPassword) {
        // Admin left the password blank → surface the generated one to share.
        setTemp(res.tempPassword);
      } else {
        toast.success(res.created ? "Account created." : "User updated.");
        setOpen(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Provisioning failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus className="size-4" /> Add member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Add team member</DialogTitle></DialogHeader>
        {temp ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Account created. Share this password securely — they can change it after first sign-in.</p>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-chip p-3 font-mono text-sm">
              <span className="truncate">{temp}</span>
              <button type="button" onClick={() => { navigator.clipboard.writeText(temp); setCopied(true); }} aria-label="Copy password">
                {copied ? <Check className="size-4 text-[#1F9D55]" /> : <Copy className="size-4" />}
              </button>
            </div>
            <DialogFooter><Button onClick={() => setOpen(false)}>Done</Button></DialogFooter>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="add-name">Name</Label>
              <Input id="add-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-email">Email</Label>
              <Input id="add-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`name${ORG_DOMAIN}`} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="add-pw">Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="add-pw"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to auto-generate"
                    autoComplete="new-password"
                    className="pr-9 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => { setPassword(generatePassword()); setShowPw(true); }}
                  aria-label="Generate password"
                  title="Generate a strong password"
                >
                  <RefreshCw className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">At least 8 characters, or leave blank for a generated one.</p>
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
            <DialogFooter><Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button></DialogFooter>
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
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
        <AddMemberDialog onDone={load} />
      </div>
      {users === null ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : users.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No users yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {users.map((u) => (
            <li key={u.uid} className="flex flex-wrap items-center gap-3 py-3">
              <Avatar className="size-9"><AvatarFallback className="bg-chip text-xs font-semibold">{initials(u.name ?? "", u.email)}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{u.name || u.email}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.name ? `${u.email} · ` : ""}
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

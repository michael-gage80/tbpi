"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/staff/theme-toggle";
import { BrandLogo } from "@/components/staff/brand-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // 1) Client Auth session (drives realtime reads + callables).
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // 2) Mint the httpOnly __session cookie (gates server routes + writes).
      const idToken = await cred.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Sign-in failed.");
      }
      router.replace("/ops");
    } catch (err) {
      const message =
        err instanceof Error && /auth\/(invalid|wrong|user-not)/.test(err.message)
          ? "Incorrect email or password."
          : err instanceof Error
            ? err.message
            : "Sign-in failed.";
      setError(message);
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo className="h-11" />
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            Operations
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Staff sign-in</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@theblackpolicyinstitute.org"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Access is invite-only. Use the temporary password your admin shared, then change it
            from your profile.
          </p>
        </form>
      </div>
    </div>
  );
}

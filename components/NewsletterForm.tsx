"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

interface Props {
  variant: "banner" | "footer";
}

export function NewsletterForm({ variant }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
      } else {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`flex items-center gap-2 ${variant === "banner" ? "justify-center text-white" : "text-white/70"}`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <CheckCircle className="size-4 text-[#E8581A] shrink-0" />
        <span className="text-sm">You&rsquo;re subscribed. Welcome to Policy Pulse!</span>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          disabled={status === "loading"}
          className="h-12 flex-1 px-4 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:border-[#E8581A] transition-colors disabled:opacity-50"
          style={{ fontFamily: "var(--font-inter)" }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-12 px-8 bg-[#E8581A] hover:bg-[#C44A13] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-60 whitespace-nowrap"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-1 sm:col-span-2 text-center" style={{ fontFamily: "var(--font-inter)" }}>
            {errorMsg}
          </p>
        )}
      </form>
    );
  }

  // footer variant
  return (
    <div className="w-full md:w-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          disabled={status === "loading"}
          className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E8581A] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 bg-[#E8581A] hover:bg-[#C44A13] text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "var(--font-inter)" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}

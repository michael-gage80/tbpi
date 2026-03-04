"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "tbpi_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white px-4 py-4 sm:px-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm text-zinc-600 leading-relaxed"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          We use cookies to analyse site traffic and improve your experience.
          By clicking <strong>Accept</strong>, you consent to our use of
          analytics cookies. You can read our{" "}
          <a
            href="/privacy"
            className="underline underline-offset-2 hover:text-zinc-900 transition-colors"
          >
            Privacy Policy
          </a>{" "}
          for more detail.
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            onClick={decline}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-90"
            style={{ backgroundColor: "#E8581A", fontFamily: "var(--font-inter)" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

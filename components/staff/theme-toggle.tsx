"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/staff/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

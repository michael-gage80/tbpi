"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";
const STORAGE_KEY = "tbpi_theme";
const CALM_KEY = "tbpi_calm";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  calm: boolean;
  setCalm: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

/**
 * Dashboard-scoped theme + motion preference. Toggles a `dark` class on the
 * wrapper (not <html>) so the public site stays light. "Calm mode" forces
 * reduced motion via MotionConfig. Both persist in localStorage.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [calm, setCalmState] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "dark" || stored === "light") setThemeState(stored);
    if (window.localStorage.getItem(CALM_KEY) === "1") setCalmState(true);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    window.localStorage.setItem(STORAGE_KEY, t);
  };
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  const setCalm = (v: boolean) => {
    setCalmState(v);
    window.localStorage.setItem(CALM_KEY, v ? "1" : "0");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme, calm, setCalm }}>
      <MotionConfig reducedMotion={calm ? "always" : "user"}>
        <div className={cn("ops-surface min-h-screen bg-background text-foreground", theme === "dark" && "dark")}>
          {children}
        </div>
      </MotionConfig>
    </ThemeContext.Provider>
  );
}

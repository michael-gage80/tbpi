import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/staff/theme-provider";
import { AppToaster } from "@/components/staff/toaster";

// Wraps both /login and /staff/* with the dashboard-scoped theme + toasts.
// (Route group — no URL segment.)
export default function StaffGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}

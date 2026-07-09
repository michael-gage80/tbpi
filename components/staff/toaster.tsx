"use client";

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/components/staff/theme-provider";

// Sonner portals to <body>, outside the dashboard `.dark` wrapper, so it needs
// the theme passed explicitly rather than inherited via CSS variables.
export function AppToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="bottom-center" richColors />;
}

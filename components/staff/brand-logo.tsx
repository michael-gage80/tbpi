"use client";

import Image from "next/image";
import { useTheme } from "@/components/staff/theme-provider";
import { cn } from "@/lib/utils";

// Theme-aware TBPI wordmark: white-text logo on the dark theme, full-colour
// (black-text) logo on the light theme. Both assets are 2000×700.
export function BrandLogo({ className }: { className?: string }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/images/logo/tbpi-white.png" : "/images/logo/logo.png";
  return (
    <Image
      src={src}
      alt="The Black Policy Institute"
      width={2000}
      height={700}
      priority
      className={cn("w-auto object-contain", className)}
    />
  );
}

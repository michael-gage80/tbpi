"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/staff/theme-provider";

export function CalmToggle() {
  const { calm, setCalm } = useTheme();
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor="calm" className="text-sm font-medium text-foreground">Calm mode</Label>
        <p className="text-xs text-muted-foreground">Reduce animations and ambient motion across the dashboard.</p>
      </div>
      <Switch id="calm" checked={calm} onCheckedChange={setCalm} />
    </div>
  );
}

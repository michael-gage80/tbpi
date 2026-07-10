"use client";

import { useState, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

async function cropToBase64(src: string, area: Area): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = src;
  });
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", 0.9).split(",")[1];
}

export function AvatarCropDialog({
  src,
  open,
  onOpenChange,
  onCropped,
}: {
  src: string | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCropped: (base64: string) => Promise<void>;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPx, setAreaPx] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onComplete = useCallback((_: Area, px: Area) => setAreaPx(px), []);

  async function save() {
    if (!src || !areaPx) return;
    setBusy(true);
    try {
      const b64 = await cropToBase64(src, areaPx);
      await onCropped(b64);
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Crop photo</DialogTitle></DialogHeader>
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-foreground/5">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onComplete}
            />
          )}
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-[color:var(--primary)]"
          aria-label="Zoom"
        />
        <DialogFooter>
          <Button onClick={save} disabled={busy || !areaPx}>{busy ? "Saving…" : "Save photo"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

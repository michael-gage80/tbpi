"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/staff/theme-provider";

export interface GlobeMarker {
  code: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  visitors: number;
  share: number; // 0..1 of total
  rank: number; // 1-based
}

/**
 * Marker world vector matches cobe's own placement convention (derived from its
 * `locationToAngles`), so our HTML overlay dots register with the dotted
 * continents cobe renders. Camera = yaw(phi) about Y, then pitch(theta) about X.
 */
function project(lat: number, lng: number, phi: number, theta: number, R: number, c: number) {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180;
  const wx = Math.cos(la) * Math.cos(lo);
  const wy = Math.sin(la);
  const wz = -Math.cos(la) * Math.sin(lo);
  const cp = Math.cos(phi), sp = Math.sin(phi);
  const a = wx * cp + wz * sp;
  const cz = -wx * sp + wz * cp;
  const ct = Math.cos(theta), st = Math.sin(theta);
  const y = wy * ct - cz * st;
  const z = wy * st + cz * ct;
  return { x: c + a * R, y: c - y * R, facing: z };
}

// Bring a marker to front-centre (cobe convention).
const focusAngles = (lat: number, lng: number): [number, number] => [
  Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
  (lat * Math.PI) / 180,
];

// cobe draws the dotted sphere surface at radius ee=0.8 of the half-canvas
// (its markers sit +0.05 above it). We want our dots ON the surface, so 0.8.
const RADIUS_K = 0.8;

export function VisitorGlobe({
  markers,
  active,
  onHover,
  onSelect,
  focusSeq,
}: {
  markers: GlobeMarker[];
  active: string | null;
  onHover: (code: string | null) => void;
  onSelect: (code: string) => void;
  focusSeq: { code: string; seq: number } | null;
}) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Live animation state (mutated in the render loop, no re-renders).
  const phiRef = useRef(0);
  const thetaRef = useRef(0.3);
  const focusTargetRef = useRef<[number, number] | null>(null);
  const draggingRef = useRef(false);
  const idleUntilRef = useRef(0);
  const tRef = useRef(0);
  const screenRef = useRef<{ x: number; y: number; facing: number }[]>([]);
  const activeRef = useRef<string | null>(active);
  const markersRef = useRef(markers);
  const reduceRef = useRef(reduce);
  useEffect(() => {
    activeRef.current = active;
    markersRef.current = markers;
    reduceRef.current = reduce;
  });

  const maxVisitors = Math.max(1, ...markers.map((m) => m.visitors));

  // Kick a focus animation when the parent bumps focusSeq.
  useEffect(() => {
    if (!focusSeq) return;
    const m = markers.find((x) => x.code === focusSeq.code);
    if (m) {
      focusTargetRef.current = focusAngles(m.lat, m.lng);
      idleUntilRef.current = tRef.current + 2200;
    }
  }, [focusSeq, markers]);

  // Build / rebuild the cobe globe on theme or size change.
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    let size = overlay.clientWidth || 480;
    const dark = theme === "dark";

    const light = {
      dark: 0,
      diffuse: 1.1,
      mapBrightness: 2.2,
      baseColor: [0.87, 0.85, 0.82] as [number, number, number],
      glowColor: [0.98, 0.96, 0.93] as [number, number, number],
    };
    const night = {
      dark: 1,
      diffuse: 1.25,
      mapBrightness: 5.6,
      baseColor: [0.21, 0.2, 0.18] as [number, number, number],
      glowColor: [0.09, 0.08, 0.07] as [number, number, number],
    };
    const c = dark ? night : light;

    let globe: ReturnType<typeof createGlobe> | null = null;
    let raf = 0;

    const build = () => {
      globe?.destroy();
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
        width: size * 2,
        height: size * 2,
        phi: phiRef.current,
        theta: thetaRef.current,
        dark: c.dark,
        diffuse: c.diffuse,
        mapSamples: 16000,
        mapBrightness: c.mapBrightness,
        baseColor: c.baseColor,
        markerColor: [0.95, 0.42, 0.2],
        glowColor: c.glowColor,
        markers: [],
      });
    };

    // cobe v2 renders on demand via update(); we drive our own frame loop so we
    // can rotate the sphere and reposition the HTML markers in lockstep.
    const loop = () => {
      const now = tRef.current;
      tRef.current += 16;

      const ft = focusTargetRef.current;
      if (ft) {
        phiRef.current += (ft[0] - phiRef.current) * 0.08;
        thetaRef.current += (ft[1] - thetaRef.current) * 0.08;
        if (Math.abs(ft[0] - phiRef.current) < 0.002) focusTargetRef.current = null;
      } else if (!draggingRef.current && !reduceRef.current && now > idleUntilRef.current) {
        phiRef.current += 0.0016;
      }

      globe?.update({ phi: phiRef.current, theta: thetaRef.current });

      const R = (size / 2) * RADIUS_K;
      const list = markersRef.current;
      const screens: { x: number; y: number; facing: number }[] = [];
      for (let i = 0; i < list.length; i++) {
        const m = list[i];
        const p = project(m.lat, m.lng, phiRef.current, thetaRef.current, R, size / 2);
        screens.push(p);
        const el = dotRefs.current[i];
        if (!el) continue;
        const front = p.facing > 0.02;
        const depth = Math.max(0, Math.min(1, (p.facing + 0.1) / 1.1));
        const isActive = activeRef.current === m.code;
        el.style.transform = `translate(-50%,-50%) translate(${p.x}px,${p.y}px) scale(${(front ? 1 : 0.6) * (isActive ? 1.25 : 1)})`;
        el.style.opacity = front ? String(0.35 + 0.65 * depth) : "0";
        el.style.zIndex = String(isActive ? 50 : 10 + Math.round(depth * 20));
        el.style.pointerEvents = front ? "auto" : "none";
      }
      screenRef.current = screens;

      raf = requestAnimationFrame(loop);
    };

    build();
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      const w = overlay.clientWidth;
      if (w && Math.abs(w - size) > 1) {
        size = w;
        build();
      }
    });
    ro.observe(overlay);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      globe?.destroy();
    };
  }, [theme]);

  // Pointer: drag to rotate + hover/click hit-testing against projected markers.
  function hitTest(clientX: number, clientY: number): number {
    const overlay = overlayRef.current;
    if (!overlay) return -1;
    const r = overlay.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    let best = -1;
    let bestD = 22 * 22; // px hit radius²
    const screens = screenRef.current;
    for (let i = 0; i < screens.length; i++) {
      const s = screens[i];
      if (s.facing <= 0.02) continue;
      const dx = s.x - x;
      const dy = s.y - y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  const lastPos = useRef({ x: 0, y: 0, moved: 0 });

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    focusTargetRef.current = null;
    lastPos.current = { x: e.clientX, y: e.clientY, moved: 0 };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (draggingRef.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current.moved += Math.abs(dx) + Math.abs(dy);
      phiRef.current += dx * 0.006;
      thetaRef.current = Math.max(-1.1, Math.min(1.1, thetaRef.current + dy * 0.006));
      lastPos.current = { x: e.clientX, y: e.clientY, moved: lastPos.current.moved };
    } else {
      const hit = hitTest(e.clientX, e.clientY);
      onHover(hit >= 0 ? markers[hit].code : null);
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    const wasDrag = lastPos.current.moved > 6;
    draggingRef.current = false;
    idleUntilRef.current = tRef.current + 2600;
    if (!wasDrag) {
      const hit = hitTest(e.clientX, e.clientY);
      if (hit >= 0) onSelect(markers[hit].code);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="relative mx-auto aspect-square w-full max-w-[440px] cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => {
        draggingRef.current = false;
        onHover(null);
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" style={{ contain: "layout paint size" }} />

      {/* HTML marker overlay (positioned every frame by onRender) */}
      <div className="pointer-events-none absolute inset-0">
        {markers.map((m, i) => {
          const scale = 0.45 + 0.55 * Math.sqrt(m.visitors / maxVisitors);
          const px = Math.round(9 + scale * 11);
          const isActive = active === m.code;
          return (
            <div
              key={m.code}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
              style={{ pointerEvents: "none" }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: px,
                  height: px,
                  background:
                    "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--primary) 92%, white), var(--primary) 60%, color-mix(in srgb, var(--primary) 55%, transparent))",
                  boxShadow: isActive
                    ? "0 0 0 3px color-mix(in srgb, var(--primary) 30%, transparent), 0 0 18px 4px color-mix(in srgb, var(--primary) 70%, transparent)"
                    : "0 0 10px 1px color-mix(in srgb, var(--primary) 55%, transparent)",
                  transition: "box-shadow .2s",
                }}
              />
              {isActive && !reduce && (
                <span
                  className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: px,
                    height: px,
                    border: "1.5px solid var(--primary)",
                    animation: "globePing 1.4s ease-out infinite",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip for the active marker */}
      <ActiveTooltip markers={markers} active={active} screenRef={screenRef} />
    </div>
  );
}

function ActiveTooltip({
  markers,
  active,
  screenRef,
}: {
  markers: GlobeMarker[];
  active: string | null;
  screenRef: React.RefObject<{ x: number; y: number; facing: number }[]>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = active ? markers.findIndex((m) => m.code === active) : -1;

  useEffect(() => {
    if (idx < 0) return;
    let raf = 0;
    const tick = () => {
      const s = screenRef.current?.[idx];
      const el = ref.current;
      if (s && el) {
        el.style.transform = `translate(-50%,-140%) translate(${s.x}px,${s.y}px)`;
        el.style.opacity = s.facing > 0.02 ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, screenRef]);

  if (idx < 0) return null;
  const m = markers[idx];
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-0 top-0 z-[60] whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-background shadow-card"
      style={{ opacity: 0 }}
    >
      <span className="mr-1.5">{m.flag}</span>
      <span className="text-sm font-semibold">{m.name}</span>
      <span className="ml-2 text-xs opacity-80">
        {m.visitors.toLocaleString()} · {(m.share * 100).toFixed(1)}%
      </span>
    </div>
  );
}

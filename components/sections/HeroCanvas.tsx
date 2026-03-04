"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  isAccent: boolean;
  label?: string;
  glowPhase: number;
  glowSpeed: number;
  opacity: number;
}

const ACCENT_LABELS = [
  "EQUITY",
  "JUSTICE",
  "POLICY",
  "COMMUNITY",
  "RESEARCH",
  "CHANGE",
  "EDUCATION",
  "HEALTH",
];
const CONNECT_DISTANCE = 150;
const MOUSE_ATTRACT_RADIUS = 200;
const MOUSE_ATTRACT_FORCE = 0.012;
const VELOCITY_RETURN_RATE = 0.08;
const MAX_SPEED = 0.6;
const FRAME_MIN_MS = 1000 / 62;
const COLOR_ACCENT = [232, 88, 26] as const;
const COLOR_LINE_ORANGE = [232, 88, 26] as const;
const COLOR_LINE_WHITE = [255, 255, 255] as const;

function createNodes(width: number, height: number, isMobile: boolean): Node[] {
  const count = isMobile ? 35 : 70;
  const nodes: Node[] = [];

  for (let i = 0; i < count; i++) {
    const isAccent = i < ACCENT_LABELS.length;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.15 + Math.random() * 0.3;
    const baseVx = Math.cos(angle) * speed;
    const baseVy = Math.sin(angle) * speed;

    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: baseVx,
      vy: baseVy,
      baseVx,
      baseVy,
      radius: isAccent ? 5 + Math.random() * 2 : 2 + Math.random() * 2,
      isAccent,
      label: isAccent ? ACCENT_LABELS[i] : undefined,
      glowPhase: Math.random() * Math.PI * 2,
      glowSpeed: 0.02 + Math.random() * 0.02,
      opacity: 0,
    });
  }

  return nodes;
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let rafId = 0;
    let lastTime = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      resize();
      const isMobile = width < 640;
      nodes = createNodes(width, height, isMobile);
    }

    function clampSpeed(node: Node) {
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
      if (speed > MAX_SPEED) {
        node.vx = (node.vx / speed) * MAX_SPEED;
        node.vy = (node.vy / speed) * MAX_SPEED;
      }
    }

    function tick(timestamp: number) {
      if (document.hidden) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (lastTime === 0) {
        lastTime = timestamp;
        rafId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = timestamp - lastTime;
      if (elapsed < FRAME_MIN_MS) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      lastTime = timestamp;

      ctx!.clearRect(0, 0, width, height);

      // Update physics
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distSq = dx * dx + dy * dy;
        const attractRadiusSq = MOUSE_ATTRACT_RADIUS * MOUSE_ATTRACT_RADIUS;

        if (mouse.active && distSq < attractRadiusSq) {
          const dist = Math.sqrt(distSq);
          const strength = MOUSE_ATTRACT_FORCE * (1 - dist / MOUSE_ATTRACT_RADIUS);
          node.vx += (dx / dist) * strength;
          node.vy += (dy / dist) * strength;
        } else {
          node.vx += (node.baseVx - node.vx) * VELOCITY_RETURN_RATE;
          node.vy += (node.baseVy - node.vy) * VELOCITY_RETURN_RATE;
        }

        clampSpeed(node);

        node.x += node.vx;
        node.y += node.vy;

        // Boundary bounce
        if (node.x < 0) {
          node.x = 0;
          node.vx = Math.abs(node.vx);
          node.baseVx = Math.abs(node.baseVx);
        } else if (node.x > width) {
          node.x = width;
          node.vx = -Math.abs(node.vx);
          node.baseVx = -Math.abs(node.baseVx);
        }
        if (node.y < 0) {
          node.y = 0;
          node.vy = Math.abs(node.vy);
          node.baseVy = Math.abs(node.baseVy);
        } else if (node.y > height) {
          node.y = height;
          node.vy = -Math.abs(node.vy);
          node.baseVy = -Math.abs(node.baseVy);
        }

        node.glowPhase += node.glowSpeed;
        if (node.opacity < 1) node.opacity = Math.min(1, node.opacity + 0.016);
      }

      const connectDistSq = CONNECT_DISTANCE * CONNECT_DISTANCE;

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > connectDistSq) continue;

          const proximity = 1 - Math.sqrt(distSq) / CONNECT_DISTANCE;
          const edgeOpacity = proximity * 0.5 * Math.min(a.opacity, b.opacity);
          const isOrange = a.isAccent || b.isAccent;
          const [r, g, bC] = isOrange ? COLOR_LINE_ORANGE : COLOR_LINE_WHITE;

          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.strokeStyle = `rgba(${r},${g},${bC},${edgeOpacity})`;
          ctx!.lineWidth = isOrange ? 0.8 : 0.5;
          ctx!.stroke();
        }
      }

      // Draw nodes
      for (const node of nodes) {
        if (node.isAccent) {
          const pulse = 0.5 + 0.5 * Math.sin(node.glowPhase);
          const glowRadius = node.radius * (3 + pulse * 2);

          const grad = ctx!.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowRadius
          );
          const glowAlpha = (0.25 + pulse * 0.2) * node.opacity;
          const [r, g, b] = COLOR_ACCENT;
          grad.addColorStop(0, `rgba(${r},${g},${b},${glowAlpha})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

          ctx!.beginPath();
          ctx!.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();

          // Solid core
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${COLOR_ACCENT[0]},${COLOR_ACCENT[1]},${COLOR_ACCENT[2]},${node.opacity})`;
          ctx!.fill();

          // Label
          if (node.label) {
            ctx!.font = `600 9px Inter, sans-serif`;
            ctx!.textAlign = "center";
            ctx!.fillStyle = `rgba(255,255,255,${0.55 * node.opacity})`;
            ctx!.fillText(node.label, node.x, node.y + node.radius + 12);
          }
        } else {
          ctx!.beginPath();
          ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255,255,255,${0.4 * node.opacity})`;
          ctx!.fill();
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onResize() {
      resize();
    }

    function onVisibilityChange() {
      if (!document.hidden) {
        lastTime = 0;
      }
    }

    init();
    rafId = requestAnimationFrame(tick);

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}

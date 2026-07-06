"use client";

import { useEffect, useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";

const BASALT = "#151C18";
const STONE = "#E4E2DB";

/** A coloured owner ring: which ring index it lands on and its colour. */
export interface RingMarker {
  ring: number;
  colour: string;
}

// The landing's placeholder ownership marks, sampled from the accent palette.
const DEFAULT_MARKERS: RingMarker[] = [
  { ring: 8, colour: "rgba(201,123,61,.9)" },
  { ring: 15, colour: "rgba(180,104,94,.9)" },
  { ring: 22, colour: "rgba(94,122,107,.9)" },
];

interface Ripple {
  x: number;
  y: number;
  t0: number;
}

/**
 * Category 04, Tables. Concentric rings with grain wobble that breathe and
 * swell toward the cursor; certain rings are coloured as marks of ownership.
 * Touching or clicking the surface adds a ring of your own, a ripple that
 * travels out and fades. Bone and accent lines on basalt. Reused on piece pages
 * with real provenance rows via `markers`. Under reduced motion it renders one
 * settled frame. Touch never traps vertical scroll (touch-action: pan-y).
 */
export default function ProvenanceRings({
  label,
  markers = DEFAULT_MARKERS,
  ground = "dark",
}: {
  label: string;
  markers?: RingMarker[];
  /** dark: bone on basalt (the Tables room); light: ink on stone, seamless
   *  with a stone page (the piece page provenance diagram). */
  ground?: "dark" | "light";
}) {
  const dark = ground !== "light";
  const bg = dark ? BASALT : STONE;
  const lineRGB = dark ? "221,217,204" : "30,33,30";
  const wobble = useRef<number[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const clock = useRef(0);

  const canvasRef = useCanvasScene({
    init: () => {
      if (!wobble.current.length) {
        const w: number[] = [];
        for (let i = 0; i < 64; i++) w.push(Math.random() * Math.PI * 2);
        wobble.current = w;
      }
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      clock.current = t;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const p = s.pointer;
      const maxR = Math.min(w, h) * 0.44;
      const wob = wobble.current;
      let ringNo = 0;
      for (let R = 12; R < maxR; R += 11, ringNo++) {
        const marker = markers.find((m) => m.ring === ringNo);
        // Weight the ownership rings so they read against the grain even on a
        // small mobile canvas, where a 1px desaturated ring can vanish.
        ctx.lineWidth = marker ? 2 : 1;
        ctx.strokeStyle = marker
          ? marker.colour
          : "rgba(" +
            lineRGB +
            "," +
            Math.max(0.07, 0.42 - (R / maxR) * 0.34) +
            ")";
        ctx.beginPath();
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const grain =
            Math.sin(a * 3 + wob[ringNo % 64]) * 2.2 +
            Math.sin(a * 7 + wob[(ringNo * 3) % 64]) * 1.1;
          const breathe = Math.sin(R * 0.05 + t * 0.9) * 1.6;
          const rr = R + grain + breathe;
          let px = cx + Math.cos(a) * rr;
          let py = cy + Math.sin(a) * rr;
          const dx = px - p.x;
          const dy = py - p.y;
          let swell = Math.exp(-(dx * dx + dy * dy) / 12000) * 8;
          const chapters = ripples.current;
          for (let k = 0; k < chapters.length; k++) {
            const ch = chapters[k];
            const age = t - ch.t0;
            if (age < 8) {
              const dd = Math.hypot(px - ch.x, py - ch.y);
              swell +=
                Math.sin(dd * 0.09 - age * 3) *
                8 *
                Math.exp(-dd / 220) *
                (1 - age / 8);
            }
          }
          px += Math.cos(a) * swell;
          py += Math.sin(a) * swell;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    },
  });

  // Touch or click to add a ring of your own.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ripples.current.push({
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        t0: clock.current,
      });
      if (ripples.current.length > 5) ripples.current.shift();
    };
    el.addEventListener("pointerdown", onDown, { passive: true });
    return () => el.removeEventListener("pointerdown", onDown);
  }, [canvasRef]);

  return <canvas ref={canvasRef} aria-label={label} />;
}

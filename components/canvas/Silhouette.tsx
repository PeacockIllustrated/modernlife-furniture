"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { clamp, ease } from "@/lib/anim";

const STONE = "#E4E2DB";

const ink = (a: number): string => "rgba(30,33,30," + a.toFixed(3) + ")";

/**
 * Category 05, Modern classics. The chairs of this era are still in
 * production and drawn in a single confident line, so the study is a run of
 * the same chair in profile, each one caught at a different stage of being
 * drawn: the first barely begun at the back foot, the last closed at the
 * front. The stage travels along the row, so the panel reads as a line being
 * laid down again and again to the same specification, which is what a
 * modern classic is.
 *
 * Abstract on purpose: a modern chair in profile, never a maker's chair.
 * Under reduced motion the row holds, every chair at its own fixed stage,
 * with the complete one at the end; nothing is lost.
 */

type Seg =
  | { k: "L"; x: number; y: number }
  | { k: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number };

// The profile in chair space: x forward, y down, 1 is the floor. Straight
// runs for the legs and the seat, curves only where a chair actually curves,
// so it reads as a chair rather than a shape.
const START = { x: 0.16, y: 1 };
const SEGS: Seg[] = [
  // the back leg, leaning forward as it rises to the seat line
  { k: "L", x: 0.3, y: 0.54 },
  // the back post continuing up, easing back a little
  { k: "C", x1: 0.285, y1: 0.36, x2: 0.25, y2: 0.24, x: 0.275, y: 0.12 },
  // the crown, turning forward across a flatter top rail
  { k: "C", x1: 0.288, y1: 0.048, x2: 0.415, y2: 0.042, x: 0.452, y: 0.122 },
  // down the inner face of the back to where the seat meets it
  { k: "C", x1: 0.468, y1: 0.232, x2: 0.442, y2: 0.384, x: 0.437, y: 0.5 },
  // the seat: a long, near flat run forward with the faintest dish
  { k: "C", x1: 0.55, y1: 0.525, x2: 0.68, y2: 0.522, x: 0.79, y: 0.495 },
  // the front lip rolling over
  { k: "C", x1: 0.835, y1: 0.487, x2: 0.85, y2: 0.522, x: 0.83, y: 0.56 },
  // the front leg, straight to the floor
  { k: "L", x: 0.8, y: 1 },
];

const X_MIN = 0.16;
const X_MAX = 0.85;

const cubic = (a: number, b: number, c: number, d: number, u: number): number => {
  const m = 1 - u;
  return m * m * m * a + 3 * m * m * u * b + 3 * m * u * u * c + u * u * u * d;
};

/** The path sampled to a polyline once, in chair space. */
function samplePath(): [number, number][] {
  const pts: [number, number][] = [[START.x, START.y]];
  let cx = START.x;
  let cy = START.y;
  for (const s of SEGS) {
    const n = s.k === "L" ? 14 : 44;
    for (let i = 1; i <= n; i++) {
      const u = i / n;
      if (s.k === "L") {
        pts.push([cx + (s.x - cx) * u, cy + (s.y - cy) * u]);
      } else {
        pts.push([cubic(cx, s.x1, s.x2, s.x, u), cubic(cy, s.y1, s.y2, s.y, u)]);
      }
    }
    cx = s.x;
    cy = s.y;
  }
  return pts;
}

export default function Silhouette({ label }: { label: string }) {
  const ptsRef = useRef<[number, number][]>([]);
  const cumRef = useRef<number[]>([]);
  const phaseRef = useRef(0);

  const canvasRef = useCanvasScene({
    init: (s) => {
      ptsRef.current = samplePath();
      const cum = [0];
      const pts = ptsRef.current;
      for (let i = 1; i < pts.length; i++) {
        cum.push(
          cum[i - 1] +
            Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]),
        );
      }
      cumRef.current = cum;
      if (s.reduced) phaseRef.current = 0.62;
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const pts = ptsRef.current;
      const cum = cumRef.current;
      if (pts.length < 2) return;
      const total = cum[cum.length - 1];

      // The row: as many chairs as the panel can hold without crowding, each
      // sized off the height so a short band never squashes them.
      // A narrow panel (a phone, or an era tile on the home page) shows one
      // chair drawn large; a wide band shows the run. Three small chairs in a
      // tile read as clutter, one reads as a drawing.
      const narrow = w < 520;
      const chairH = narrow
        ? Math.min(h * 0.72, w * 0.62)
        : Math.min(h * 0.66, w * 0.2);
      const span = chairH * (X_MAX - X_MIN);
      const gap = chairH * 0.42;
      const count = narrow
        ? 1
        : Math.max(1, Math.min(6, Math.floor((w * 0.86) / (span + gap))));
      const rowW = count * span + (count - 1) * gap;
      const left = (w - rowW) / 2;
      const floorY = h * 0.84;

      // The stage travels along the row; the pointer pushes it along faster.
      if (!s.reduced) {
        const p = s.pointer;
        const push = p.inside ? 0.06 : 0;
        phaseRef.current = (t * 0.045 + push * t) % 1;
      }

      /* ---- the floor every chair stands on, one line under the row ---- */
      ctx.strokeStyle = ink(0.14);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left - gap * 0.6, floorY);
      ctx.lineTo(left + rowW + gap * 0.6, floorY);
      ctx.stroke();

      for (let c = 0; c < count; c++) {
        const originX = left + c * (span + gap);
        const X = (x: number) => originX + (x - X_MIN) * chairH;
        const Y = (y: number) => floorY - (1 - y) * chairH;

        // Each chair sits a step further through the stroke than the last,
        // and the whole row advances, so the drawing never stalls.
        const stagger = count > 1 ? c / (count - 1) : 1;
        const raw = (phaseRef.current + stagger * 0.82) % 1;
        // Draw across most of the cycle, then hold closed for a beat.
        const p = ease(clamp(raw / 0.74, 0, 1));
        const head = p * total;

        const strokeRange = (
          from: number,
          to: number,
          style: string,
          lw: number,
        ) => {
          if (to <= from) return;
          ctx.strokeStyle = style;
          ctx.lineWidth = lw;
          ctx.beginPath();
          let started = false;
          for (let i = 1; i < pts.length; i++) {
            const a = cum[i - 1];
            const b = cum[i];
            if (b < from || a > to) continue;
            const [x0, y0] = pts[i - 1];
            const [x1, y1] = pts[i];
            const seg = b - a || 1;
            const u0 = clamp((from - a) / seg, 0, 1);
            const u1 = clamp((to - a) / seg, 0, 1);
            if (!started) {
              ctx.moveTo(X(x0 + (x1 - x0) * u0), Y(y0 + (y1 - y0) * u0));
              started = true;
            }
            ctx.lineTo(X(x0 + (x1 - x0) * u1), Y(y0 + (y1 - y0) * u1));
          }
          ctx.stroke();
        };

        // the line still to come, held faint so no chair is ever a gap
        strokeRange(head, total, ink(0.13), 1);
        // the line as drawn
        strokeRange(0, head, ink(0.8), 1.5);
        // the sheen at the head of the stroke, light running along the metal
        if (p > 0.01 && p < 0.995) {
          strokeRange(Math.max(0, head - total * 0.11), head, ink(0.95), 1.9);
        }
      }
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}

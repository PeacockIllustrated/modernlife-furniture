"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { clamp, lerp } from "@/lib/anim";
import { monoCanvasFont } from "@/lib/canvasFont";

const STONE = "#E4E2DB";
const CONTOURS = 11;
const SAMPLES = 96;

/* Generic acts of restoration, never a piece or a maker. */
const NOTES = [
  "seam / opened along the joint",
  "faces / cleaned back to timber",
  "stitch / bridged, reversible",
  "grain / matched through the break",
  "close / clamped and left to rest",
];

const ink = (a: number): string => "rgba(30,33,30," + a.toFixed(3) + ")";

const smooth = (a: number, b: number, x: number): number => {
  const u = clamp((x - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};

/**
 * Category 05, Restoration. Contour lines forming a single grain figure that
 * cleaves along a vertical seam as you approach the panel edge, hatched
 * stitches bridging the gap, then closing and healing to a faint line of
 * scars at rest. Abstract on purpose: it is the act of restoration, not any
 * particular piece. Separation follows cursor distance from the centre
 * (matching the hint, move to the edge to take the piece apart), breathes
 * apart and together when unattended, and under reduced motion holds one
 * part-separated, stitched, annotated still.
 */
export default function Seam({ label }: { label: string }) {
  const eRef = useRef(0.3); // separation, eased
  const phases = useRef<number[][]>([]);
  const fontRef = useRef("11px monospace");

  const canvasRef = useCanvasScene({
    init: (s) => {
      phases.current = Array.from({ length: CONTOURS }, () => [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ]);
      fontRef.current = monoCanvasFont(11);
      if (s.reduced) eRef.current = 0.55;
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";

      const Cx = w * 0.5;
      const Cy = h * 0.47;
      const B = 0.34 * Math.min(w, h);
      const seamX = Cx;

      /* separation toward the cursor's distance from centre; idle breathing */
      if (!s.reduced) {
        const p = s.pointer;
        const target = p.inside
          ? clamp(
              Math.hypot(p.x - Cx, p.y - Cy) / (0.52 * Math.min(w, h)),
              0,
              1,
            )
          : 0.3 + 0.2 * Math.sin(t * 0.35);
        eRef.current += (target - eRef.current) * 0.06;
      }
      const e = eRef.current;
      const off = e * B * 0.34; /* half-offset per side */

      /* the register line, the drawing's spine, present from frame one */
      ctx.strokeStyle = ink(0.35);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(seamX, 0);
      ctx.lineTo(seamX, h);
      ctx.stroke();
      ctx.setLineDash([]);

      /* ---- sample the grain figure, untranslated ---- */
      const heartX = Cx - 0.2 * B;
      const heartY = Cy + 0.06 * B;
      const contours: { pts: [number, number][]; growth: boolean; a: number }[] =
        [];
      const crossings: number[] = [];
      for (let i = 0; i < CONTOURS; i++) {
        const cxI = lerp(heartX, Cx, i / (CONTOURS - 1));
        const cyI = lerp(heartY, Cy, i / (CONTOURS - 1));
        const rho = B * (0.14 + 0.86 * Math.pow(i / (CONTOURS - 1), 1.12));
        const [p1, p2, p3] = phases.current[i] ?? [0, 0, 0];
        const breathe = 1 + 0.006 * Math.sin(t * 0.6 + i * 0.5);
        const pts: [number, number][] = [];
        for (let k = 0; k <= SAMPLES; k++) {
          const th = (k / SAMPLES) * Math.PI * 2;
          const m =
            (1 +
              0.045 * Math.sin(2 * th + p1) +
              0.028 * Math.sin(5 * th + p2) +
              0.012 * Math.sin(9 * th + p3)) *
            breathe;
          pts.push([
            cxI + rho * 1.38 * Math.cos(th) * m,
            cyI + rho * 0.85 * Math.sin(th) * m,
          ]);
        }
        /* entrance: contours draw in from the heart outward on first sight */
        const enter = s.reduced ? 1 : clamp((t - i * 0.09) / 0.5, 0, 1);
        contours.push({
          pts,
          growth: i % 3 === 0,
          a: (i % 3 === 0 ? 0.55 : 0.3 + i * 0.012) * enter,
        });
        /* seam crossings, interpolated, for faces, stitches and scars */
        for (let k = 0; k < SAMPLES; k++) {
          const [x0, y0] = pts[k];
          const [x1, y1] = pts[k + 1];
          if ((x0 - seamX) * (x1 - seamX) < 0) {
            crossings.push(y0 + ((seamX - x0) / (x1 - x0)) * (y1 - y0));
          }
        }
      }

      /* stitch rungs: clamped, deduplicated, at most ten */
      const rungs: number[] = [];
      for (const y of [...crossings].sort((a, b) => a - b)) {
        if (y < Cy - 0.7 * B || y > Cy + 0.7 * B) continue;
        if (rungs.length && y - rungs[rungs.length - 1] < 6) continue;
        if (rungs.length >= 10) break;
        rungs.push(y);
      }

      /* ---- the two halves, clipped and parted along one axis only ---- */
      const drawFigure = () => {
        for (const c of contours) {
          if (c.a <= 0.01) continue;
          ctx.strokeStyle = ink(c.a);
          ctx.lineWidth = c.growth ? 1.4 : 1;
          ctx.beginPath();
          c.pts.forEach(([x, y], k) =>
            k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
          );
          ctx.stroke();
        }
        /* the heart the grain crowds around */
        ctx.strokeStyle = ink(0.6 * (contours[0]?.a ?? 0) * 1.6);
        ctx.lineWidth = 1;
        for (const hr of [B * 0.045, B * 0.02]) {
          ctx.beginPath();
          ctx.ellipse(heartX, heartY, hr * 1.38, hr * 0.85, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      };

      // Translate first, then clip in the translated space: each half is the
      // material split at the seam, carried away whole, leaving genuinely
      // clear air between the cut faces.
      for (const side of [-1, 1] as const) {
        ctx.save();
        ctx.translate(side * off, 0);
        ctx.beginPath();
        if (side < 0) ctx.rect(-off - 2, 0, seamX + off + 2, h);
        else ctx.rect(seamX, 0, w - seamX + off + 2, h);
        ctx.clip();
        drawFigure();
        ctx.restore();
      }

      /* ---- cut faces: hand-true section lines, nothing hidden ---- */
      if (off > 0.5 && rungs.length > 1) {
        for (const side of [-1, 1] as const) {
          const faceX = seamX + side * off;
          ctx.strokeStyle = ink(0.4);
          ctx.lineWidth = 1;
          ctx.beginPath();
          rungs.forEach((y, k) => {
            const x = faceX + 1.5 * Math.sin(y * 0.05 + t * 0.4);
            if (k === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
          /* end-grain ticks, pointing into their own half */
          ctx.strokeStyle = ink(0.3);
          for (const y of rungs) {
            ctx.beginPath();
            ctx.moveTo(faceX, y);
            ctx.lineTo(faceX + side * B * 0.03, y);
            ctx.stroke();
          }
        }
      }

      /* ---- stitches: hatched clusters of three thin arcs, never one fat stroke ---- */
      const fade = smooth(0.22, 0.5, e);
      if (fade > 0.01) {
        const sag = 2 * off * 0.12;
        for (const y of rungs) {
          for (const k of [-1, 0, 1]) {
            ctx.strokeStyle = ink((k === 0 ? 0.5 : 0.35) * fade);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(seamX - off, y);
            ctx.quadraticCurveTo(seamX, y + sag + k * 1.5, seamX + off, y);
            ctx.stroke();
          }
          /* anchor ticks */
          ctx.strokeStyle = ink(0.5 * fade);
          ctx.lineWidth = 1;
          for (const side of [-1, 1] as const) {
            ctx.beginPath();
            ctx.moveTo(seamX + side * off, y - 2);
            ctx.lineTo(seamX + side * off, y + 2);
            ctx.stroke();
          }
        }
      }

      /* ---- healed scars: the repair stays legible when the figure rests ---- */
      if (e < 0.18) {
        const a = ((0.18 - e) / 0.18) * 0.3;
        ctx.strokeStyle = ink(a);
        ctx.lineWidth = 1;
        const dx = 3 * Math.cos((65 * Math.PI) / 180);
        const dy = 3 * Math.sin((65 * Math.PI) / 180);
        for (const y of rungs) {
          ctx.beginPath();
          ctx.moveTo(seamX - dx, y + dy);
          ctx.lineTo(seamX + dx, y - dy);
          ctx.stroke();
        }
      }

      /* ---- the conservator's notes, measured so they never clip ---- */
      const noteA = clamp((e - 0.3) / 0.25, 0, 1) * 0.85;
      if (noteA > 0.01) {
        ctx.font = fontRef.current;
        ctx.textAlign = "right";
        const tx = w - 16;
        NOTES.forEach((note, i) => {
          const y = h * (0.18 + i * 0.16);
          const tw = ctx.measureText(note).width;
          ctx.strokeStyle = ink(0.3 * noteA);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(seamX + off + B * 0.06, y);
          ctx.lineTo(tx - tw - 8, y);
          ctx.stroke();
          ctx.fillStyle = ink(noteA);
          ctx.fillText(note, tx, y + 4);
        });
      }
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}

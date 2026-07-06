"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { clamp } from "@/lib/anim";
import { monoCanvasFont } from "@/lib/canvasFont";

const STONE = "#E4E2DB";

/* Generic acts of restoration, never a piece or a maker. */
const NOTES = [
  "joint / drawn apart",
  "tenon / cleaned to timber",
  "mortise / cleared of glue",
  "peg / renewed",
  "closed / cramped and set",
];

const ink = (a: number): string => "rgba(30,33,30," + a.toFixed(3) + ")";

/**
 * Category 05, Restoration. The joiner's language, drawn in contour lines: a
 * mortise-and-tenon, the joint at the heart of a chair or a frame. Move toward
 * the panel edge and the two members draw apart along the register line, the
 * tenon leaving the mortise with nothing hidden, its cut faces and draw-bore
 * peg laid bare; rest, and it cramps back together and sets. Abstract on
 * purpose: it is the act of restoration, taking apart and putting right, not
 * any one piece. Under reduced motion it holds one part-drawn, annotated still.
 */
export default function Joint({ label }: { label: string }) {
  const eRef = useRef(0.3); // separation, eased
  const fontRef = useRef("11px monospace");

  const canvasRef = useCanvasScene({
    init: (s) => {
      fontRef.current = monoCanvasFont(11);
      if (s.reduced) eRef.current = 0.55;
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const Cx = w * 0.5;
      const Cy = h * 0.47;
      const seamX = Cx;
      const U = Math.min(w, h);

      // Separation follows the cursor's distance from the centre; idle it
      // breathes apart and together on a roughly eighteen second breath.
      if (!s.reduced) {
        const p = s.pointer;
        const target = p.inside
          ? clamp(Math.hypot(p.x - Cx, p.y - Cy) / (0.52 * U), 0, 1)
          : 0.3 + 0.2 * Math.sin(t * 0.35);
        eRef.current += (target - eRef.current) * 0.06;
      }
      const e = eRef.current;
      const off = e * U * 0.2; // half-draw per member
      const enter = s.reduced ? 1 : clamp(t / 0.7, 0, 1);

      // Member and joint proportions.
      const stileW = U * 0.16;
      const stileH = U * 0.64;
      const railH = U * 0.28;
      const tenonH = U * 0.15;
      const tenonLen = U * 0.17;
      const mortiseDepth = tenonLen;
      const railLen = Math.min(w * 0.32, U * 0.72);

      /* register line, the drawing's spine */
      ctx.strokeStyle = ink(0.28 * enter);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(seamX, 0);
      ctx.lineTo(seamX, h);
      ctx.stroke();
      ctx.setLineDash([]);

      const outline = ink(0.72 * enter);
      const grain = ink(0.16 * enter);
      const hatch = ink(0.3 * enter);

      const strokePath = (pts: [number, number][], style: string, lw: number) => {
        ctx.strokeStyle = style;
        ctx.lineWidth = lw;
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.closePath();
        ctx.stroke();
      };
      const hatchLines = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        n: number,
        len: number,
        dir: 1 | -1,
        horizontal: boolean,
      ) => {
        ctx.strokeStyle = hatch;
        ctx.lineWidth = 0.8;
        for (let i = 1; i <= n; i++) {
          const u = i / (n + 1);
          if (horizontal) {
            const y = y0 + (y1 - y0) * u;
            ctx.beginPath();
            ctx.moveTo(x0, y);
            ctx.lineTo(x0 + dir * len, y - len * 0.5);
            ctx.stroke();
          } else {
            const x = x0 + (x1 - x0) * u;
            ctx.beginPath();
            ctx.moveTo(x, y0);
            ctx.lineTo(x - len * 0.5, y0 + dir * len);
            ctx.stroke();
          }
        }
      };

      /* ---- the stile, a vertical member with the mortise cut into its face ---- */
      const sdx = -off;
      const sTop = Cy - stileH / 2;
      const sBot = Cy + stileH / 2;
      const mTop = Cy - tenonH / 2;
      const mBot = Cy + tenonH / 2;
      const mBack = seamX - mortiseDepth + sdx;
      const sFace = seamX + sdx;
      strokePath(
        [
          [seamX - stileW + sdx, sTop],
          [sFace, sTop],
          [sFace, mTop],
          [mBack, mTop],
          [mBack, mBot],
          [sFace, mBot],
          [sFace, sBot],
          [seamX - stileW + sdx, sBot],
        ],
        outline,
        1.3,
      );
      // stile grain, vertical
      for (let i = 1; i <= 3; i++) {
        const gx = seamX - stileW + sdx + (stileW * i) / 4;
        ctx.strokeStyle = grain;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx, sTop + 6);
        ctx.lineTo(gx, sBot - 6);
        ctx.stroke();
      }
      // mortise back wall, end grain hatched when the joint is open
      if (e > 0.08) {
        hatchLines(mBack, mTop + 3, mBack, mBot - 3, 3, U * 0.03, 1, true);
      }

      /* ---- the rail, a horizontal member ending in the tenon ---- */
      const rdx = off;
      const rTop = Cy - railH / 2;
      const rBot = Cy + railH / 2;
      const rShoulder = seamX + rdx;
      const tTip = seamX - tenonLen + rdx;
      strokePath(
        [
          [rShoulder, rTop],
          [rShoulder, mTop],
          [tTip, mTop],
          [tTip, mBot],
          [rShoulder, mBot],
          [rShoulder, rBot],
          [seamX + railLen + rdx, rBot],
          [seamX + railLen + rdx, rTop],
        ],
        outline,
        1.3,
      );
      // rail grain, horizontal
      for (let i = 1; i <= 3; i++) {
        const gy = rTop + (railH * i) / 4;
        ctx.strokeStyle = grain;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rShoulder + 6, gy);
        ctx.lineTo(seamX + railLen + rdx - 6, gy);
        ctx.stroke();
      }
      // tenon end grain, hatched when open
      if (e > 0.08) {
        hatchLines(tTip, mTop + 3, tTip, mBot - 3, 3, U * 0.03, -1, true);
      }

      /* ---- the draw-bore peg: on the stile, its hole on the tenon ---- */
      const pegR = U * 0.028;
      const pegX = seamX - mortiseDepth * 0.55;
      // peg stays with the stile
      ctx.strokeStyle = outline;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(pegX + sdx, Cy, pegR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = grain;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pegX + sdx, Cy, pegR * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      // the hole it draws through, on the tenon (a touch off-centre: the
      // draw-bore that pulls the joint tight)
      ctx.strokeStyle = ink(0.4 * enter);
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pegX + rdx + U * 0.012, Cy, pegR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      /* ---- the conservator's notes, measured so they never clip ---- */
      const noteA = clamp((e - 0.3) / 0.25, 0, 1) * 0.85 * enter;
      if (noteA > 0.01) {
        ctx.font = fontRef.current;
        ctx.textAlign = "right";
        const compact = w < 560;
        const tx = w - 16;
        NOTES.forEach((note, i) => {
          const text = compact ? note.split(" / ")[0] : note;
          const y = h * (0.18 + i * 0.16);
          const tw = ctx.measureText(text).width;
          const lineEnd = tx - tw - 8;
          const lineStart = seamX + railLen + rdx + U * 0.04;
          if (lineEnd > lineStart + 12) {
            ctx.strokeStyle = ink(0.3 * noteA);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lineStart, y);
            ctx.lineTo(lineEnd, y);
            ctx.stroke();
          }
          ctx.fillStyle = ink(noteA);
          ctx.fillText(text, tx, y + 4);
        });
      }
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}

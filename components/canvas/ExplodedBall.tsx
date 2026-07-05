"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { drawBall } from "@/lib/drawBall";
import { clamp, ease, lerp } from "@/lib/anim";
import { monoCanvasFont } from "@/lib/canvasFont";

const STONE = "#E4E2DB";

/**
 * Category 05, Restoration. The same drawBall renderer, exploded along a single
 * vertical axis: shell, interior, cushions, stem and base drawn apart with
 * clear air between them, over a dashed register line. The explode factor
 * follows the cursor's distance from the chair centre; at rest the drawing
 * breathes apart and back so the interaction demonstrates itself. Conservator's
 * notes are measured and right-aligned to the panel edge so they never clip.
 * Under reduced motion it holds part-exploded (0.55) as a still.
 */
export default function ExplodedBall({ label }: { label: string }) {
  const explode = useRef(0.3);
  const noteFont = useRef<string>('11px "Spline Sans Mono", monospace');

  const canvasRef = useCanvasScene({
    init: (s) => {
      noteFont.current = monoCanvasFont(11);
      if (s.reduced) explode.current = 0.55;
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const mx = Math.min(w, h);
      const R = mx * 0.165;
      const cx = w * 0.4;
      const cy = h * 0.42;

      const p = s.pointer;
      if (s.reduced) {
        explode.current = 0.55;
      } else {
        const over = p.x > 0 && p.x < w && p.y > 0 && p.y < h;
        const targetE = over
          ? clamp(Math.hypot(p.x - cx, p.y - cy) / (mx * 0.52), 0, 1)
          : 0.3 + Math.sin(t * 0.35) * 0.2;
        explode.current += (targetE - explode.current) * 0.05;
      }
      const e = ease(explode.current);

      // Register line, the drawing's spine.
      ctx.strokeStyle = "rgba(30,33,30,.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.03);
      ctx.lineTo(cx, h * 0.9);
      ctx.stroke();
      ctx.setLineDash([]);

      // Assembled and exploded part centres, lerped: a clean vertical stack.
      const opR = R * 0.8;
      const P = {
        shellY: lerp(cy, cy - R * 1.48, e),
        intY: lerp(cy + R * 0.02, cy + R * 0.42, e),
        cushY: lerp(cy + R * 0.02 + opR * 0.42, cy + R * 1.62, e),
        stemTopY: lerp(cy + R * 0.86, cy + R * 2.02, e),
        baseY: lerp(cy + R * 1.3, cy + R * 2.85, e),
        shadowY: cy + R * 1.38 + e * R * 1.5,
      };
      drawBall(ctx, cx, R, t, 0, P, {
        shell: 1,
        interior: 1,
        cushion: 1,
        stem: 1,
        base: 1,
      });

      // Leader lines and the conservator's notes, kept inside the frame.
      const la = clamp((e - 0.3) / 0.35, 0, 1);
      if (la > 0) {
        const notes = [
          { y: P.shellY, txt: "shell / fibreglass, refinished" },
          { y: P.intY, txt: "upholstery / wool, replaced" },
          { y: P.cushY, txt: "cushions / foam, renewed" },
          { y: P.stemTopY + R * 0.24, txt: "stem / steel, re-enamelled" },
          { y: P.baseY, txt: "base / cast, rebalanced" },
        ];
        ctx.font = noteFont.current;
        ctx.textAlign = "right";
        const tx = w - 16;
        for (let i = 0; i < notes.length; i++) {
          const tw = ctx.measureText(notes[i].txt).width;
          ctx.strokeStyle = "rgba(30,33,30," + 0.35 * la + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + R * 1.15, notes[i].y);
          ctx.lineTo(tx - tw - 10, notes[i].y);
          ctx.stroke();
          ctx.fillStyle = "rgba(30,33,30," + 0.65 * la + ")";
          ctx.fillText(notes[i].txt, tx, notes[i].y + 4);
        }
        ctx.textAlign = "left";
      }
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}

"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { useScrollBind } from "@/components/scroll/useScrollBind";
import { drawBall } from "@/lib/drawBall";
import { clamp, ease } from "@/lib/anim";

const STONE = "#E4E2DB";

/**
 * Category 01, Chairs. The signature object: a space-age ball chair drawn in
 * contour lines. Its build sequence (compass sweep, interior bloom, pedestal
 * rise, cushions settling) is bound to ScrollTrigger progress, so scrubbing the
 * page scrubs the assembly. Once assembled it turns to face the cursor and, at
 * rest, sways gently so the interaction is discoverable. Under reduced motion
 * it holds as a fully assembled still.
 */
export default function BallChair({
  label,
  scrollBound = true,
}: {
  label: string;
  scrollBound?: boolean;
}) {
  const progress = useRef(0); // 0..1 build, from scroll
  const swivel = useRef(0); // eased horizontal turn

  const canvasRef = useCanvasScene({
    init: (s) => {
      // Reduced motion, or an unbound header band: assembled from the first frame.
      if (s.reduced || !scrollBound) progress.current = 1;
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const mx = Math.min(w, h);
      const R = mx * 0.28;
      const cx = w * 0.5;
      const cy = h * 0.42;

      const p = s.pointer;
      const over = !s.reduced && p.x > -100 && p.x < w + 100;
      const target = s.reduced
        ? 0
        : over
          ? clamp((p.x - cx) / (w * 0.5), -1, 1) * R * 0.14
          : Math.sin(t * 0.3) * R * 0.05;
      swivel.current += (target - swivel.current) * 0.05;

      const g = s.reduced ? 1 : progress.current;
      const pOutline = ease(g / 0.3);
      const pInner = ease((g - 0.22) / 0.34);
      const pStand = ease((g - 0.48) / 0.3);
      const pCush = ease((g - 0.68) / 0.32);

      // Compass stroke: the circumference sweeps in before the shell fills.
      if (pOutline < 1) {
        ctx.strokeStyle = "rgba(30,33,30,.8)";
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pOutline);
        ctx.stroke();
      }

      const rise = (1 - pStand) * R * 0.25;
      const P = {
        shellY: cy,
        intY: cy + R * 0.02,
        cushY: cy + R * 0.02 + R * 0.8 * 0.42,
        stemTopY: cy + R * 0.86 + rise,
        baseY: cy + R * 1.3 + rise * 1.3,
        shadowY: cy + R * 1.38,
      };

      if (pOutline >= 1) {
        drawBall(ctx, cx, R, t, swivel.current, P, {
          shell: 1,
          interior: pInner,
          cushion: pCush,
          stem: pStand,
          base: pStand,
        });
      } else if (pInner > 0) {
        drawBall(ctx, cx, R, t, swivel.current, P, {
          shell: pOutline * 0.9,
          interior: pInner,
          cushion: 0,
          stem: 0,
          base: 0,
        });
      }
    },
  });

  // Bind the build to scroll progress. Skipped under reduced motion or when the
  // chair is used as a static header band, where it is already held assembled.
  useScrollBind(canvasRef, progress, { enabled: scrollBound });

  return <canvas ref={canvasRef} aria-label={label} />;
}

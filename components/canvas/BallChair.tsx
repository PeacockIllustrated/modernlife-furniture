"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { useScrollBind } from "@/components/scroll/useScrollBind";
import {
  drawLatheChair,
  sliceLatitude,
  LATHE_SLICES,
} from "@/lib/drawBall";
import { clamp } from "@/lib/anim";

const STONE = "#E4E2DB";
const IDLE_STILL = 0.22; /* the reduced-motion still turns toward the label */

/**
 * Category 01, Chairs. The signature object, abstracted: a lathe survey of
 * the ball chair, latitude hoops whose broken mouths line up into the orange
 * cavity. The build is bound to ScrollTrigger progress (hoops sweep in as
 * compass strokes, then the mouth opens), so scrubbing the page scrubs the
 * assembly. The mouth turns to face the cursor, easing through the body slice
 * by slice so the turn has weight, and sways gently at rest. Under reduced
 * motion it holds as a finished still, turned slightly toward the label card.
 */
export default function BallChair({
  label,
  scrollBound = true,
}: {
  label: string;
  scrollBound?: boolean;
}) {
  const progress = useRef(0); // 0..1 build, from scroll
  const phis = useRef<number[]>(new Array(LATHE_SLICES).fill(0));

  const canvasRef = useCanvasScene({
    init: (s) => {
      if (s.reduced || !scrollBound) progress.current = 1;
      if (s.reduced) phis.current.fill(IDLE_STILL);
    },
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);

      const R = Math.min(w * 0.3, h * 0.31);
      const cx = w * 0.5;
      const cy = h * 0.46;

      const p = s.pointer;
      const over = !s.reduced && p.x > -100 && p.x < w + 100;
      const target = s.reduced
        ? IDLE_STILL
        : over
          ? clamp((p.x - cx) / (w * 0.35), -1, 1) * 0.55
          : Math.sin(t * 0.3) * 0.16;

      // The equator eases faster than the poles, so the turn travels through
      // the body like a person shifting in a seat rather than a turret.
      for (let i = 0; i < LATHE_SLICES; i++) {
        const f = 0.045 + 0.02 * (1 - Math.abs(sliceLatitude(i)));
        phis.current[i] += (target - phis.current[i]) * f;
      }

      drawLatheChair(ctx, {
        cx,
        cy,
        R,
        t,
        phis: phis.current,
        build: s.reduced ? 1 : progress.current,
      });
    },
  });

  useScrollBind(canvasRef, progress, { enabled: scrollBound });

  return <canvas ref={canvasRef} aria-label={label} />;
}

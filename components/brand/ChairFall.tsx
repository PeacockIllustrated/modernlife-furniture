"use client";

import { useRef } from "react";
import { chairs } from "@/lib/chairs";
import { useCanvasScene } from "@/components/canvas/useCanvasScene";

/**
 * The hero figure: the same chairs the splash throws around, still falling,
 * but slowed right down and turned into weather.
 *
 * Where the splash is an event with a beginning and an end, this is ambient:
 * pieces drift down through the panel, turning slowly, and each one that
 * leaves the bottom is put back above the top somewhere new, so the fall never
 * ends and never repeats. There is no collision and no pile; a pile fills up
 * and stops, and this has to hold for as long as somebody reads the headline.
 *
 * It is deliberately faint. The headline, the subline and the two calls to
 * action own this panel, and the chairs are behind them at an opacity where
 * they read as texture with a subject rather than as a picture competing for
 * the eye. One piece carries the brand amber, a little stronger than the rest.
 *
 * Lifecycle comes from useCanvasScene, so this obeys the same contract as
 * every other canvas on the site: device pixel ratio capped at two, the loop
 * paused whenever the panel is off-screen, deferred until the page has gone
 * idle so it never competes with the first render, and a single still frame
 * under reduced motion with nothing missing.
 */

interface Flake {
  chair: number;
  x: number;
  y: number;
  scale: number;
  angle: number;
  spin: number;
  fall: number;
  alpha: number;
  amber: boolean;
}

/** Deterministic, so the drift is the same composition on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const INK = "30,33,30";
const AMBER = "201,123,61";

export default function ChairFall() {
  const flakes = useRef<Flake[]>([]);
  const paths = useRef<Path2D[]>([]);

  const canvasRef = useCanvasScene({
    init: () => {
      paths.current = chairs.map((c) => new Path2D(c.d));
    },
    // Rebuilt on resize rather than rescaled, so the drift always suits the
    // panel it is in: a phone gets fewer, larger pieces than a desktop.
    onResize: (s) => {
      const { w, h } = s;
      if (w <= 0 || h <= 0) return;
      const rand = rng(90210);
      const unit = Math.max(64, Math.min(w, h) * 0.19);
      const count = Math.max(
        8,
        Math.min(22, Math.round((w * h) / (unit * unit * 4.4))),
      );
      flakes.current = Array.from({ length: count }, (_, i) => {
        const chair = Math.floor(rand() * chairs.length);
        const size = unit * (0.62 + rand() * 0.7);
        return {
          chair,
          x: rand() * w,
          // Spread down the panel and a little above it, so the first frame is
          // already a fall in progress rather than a row waiting to drop.
          y: -h * 0.35 + rand() * h * 1.35,
          scale: size / chairs[chair].h,
          angle: (rand() - 0.5) * 1.4,
          spin: (rand() - 0.5) * 0.16,
          fall: 32 + rand() * 52,
          alpha: 0.07 + rand() * 0.07,
          amber: i === Math.floor(count * 0.45),
        };
      });
    },
    draw: (s) => {
      const { ctx, w, h, reduced } = s;
      ctx.clearRect(0, 0, w, h);
      const dt = reduced ? 0 : 0.016;
      for (const f of flakes.current) {
        const c = chairs[f.chair];
        f.y += f.fall * dt;
        f.angle += f.spin * dt;
        // The piece is fully clear of the panel: put it back above the top,
        // somewhere else across the width, and let it fall again.
        const span = Math.max(c.w, c.h) * f.scale;
        if (f.y - span > h) {
          f.y = -span;
          f.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.scale(f.scale, f.scale);
        ctx.translate(-c.w / 2, -c.h / 2);
        ctx.fillStyle = `rgba(${f.amber ? AMBER : INK},${(f.amber ? f.alpha + 0.16 : f.alpha).toFixed(3)})`;
        ctx.fill(paths.current[f.chair]);
        ctx.restore();
      }
    },
  });

  return <canvas ref={canvasRef} className="hero-fall" aria-hidden="true" />;
}

"use client";

import { useCanvasScene } from "./useCanvasScene";

const STONE = "#E4E2DB";

/**
 * The hero field: horizontal contour lines, one per ~30px of height, each point
 * displaced by three summed sines drifting at differing speeds. The cursor
 * applies a gaussian lift within about 220px. Ink on stone, opacity ramping
 * with depth. Reads as water held still, or the grain of time. Under reduced
 * motion it renders one settled frame.
 */
export default function Tide({ label }: { label: string }) {
  const canvasRef = useCanvasScene({
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);
      const p = s.pointer;
      const rows = Math.max(20, Math.floor(h / 30));
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        const baseY = (r + 0.5) * (h / rows);
        const depth = r / rows;
        ctx.strokeStyle = "rgba(30,33,30," + (0.16 + depth * 0.34) + ")";
        ctx.beginPath();
        for (let x = 0; x <= w; x += 7) {
          let y =
            baseY +
            Math.sin(x * 0.012 + t * 0.7 + r * 0.55) * 7 +
            Math.sin(x * 0.004 - t * 0.35 + r * 0.9) * 13 +
            Math.sin(x * 0.021 + t * 1.1) * 3;
          const dx = x - p.x;
          const dy = baseY - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 48400) {
            y -= Math.exp(-d2 / 16000) * 34;
          }
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
  });

  return <canvas ref={canvasRef} aria-hidden="true" data-label={label} />;
}

"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";
import { useScrollBind } from "@/components/scroll/useScrollBind";

const BASALT = "#151C18";

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  depth: number;
  shelf?: boolean;
}

/**
 * Category 02, Shelving and storage. Seeded recursive branching from three
 * trunks at the floor line, with horizontal "shelf" segments spawning at the
 * middle depths. The collection grows as you arrive: growth is bound to scroll
 * progress (the production upgrade over the concept's timer), so scrubbing the
 * page grows and ungrows the grove. Bone lines on basalt, tapering by depth,
 * swaying per branch, brightening and lifting near the cursor. Under reduced
 * motion the grove renders fully grown.
 */
export default function Grove({
  label,
  scrollBound = true,
}: {
  label: string;
  scrollBound?: boolean;
}) {
  const segs = useRef<Seg[]>([]);
  const progress = useRef(0);

  const grow = (w: number, h: number) => {
    const out: Seg[] = [];
    const branch = (
      x: number,
      y: number,
      angle: number,
      len: number,
      depth: number,
    ) => {
      if (depth > 7 || len < 6) return;
      const nx = x + Math.cos(angle) * len;
      const ny = y + Math.sin(angle) * len;
      out.push({ x1: x, y1: y, x2: nx, y2: ny, depth });
      const n = depth < 2 ? 2 : Math.random() < 0.85 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        branch(
          nx,
          ny,
          angle + (Math.random() - 0.5) * 1.15,
          len * (0.66 + Math.random() * 0.16),
          depth + 1,
        );
      }
      if (depth >= 2 && depth <= 4 && Math.random() < 0.3) {
        out.push({
          x1: nx - len * 0.9,
          y1: ny,
          x2: nx + len * 0.9,
          y2: ny,
          depth,
          shelf: true,
        });
      }
    };
    branch(w * 0.5, h * 0.91, -Math.PI / 2, h * 0.17, 0);
    branch(w * 0.32, h * 0.91, -Math.PI / 2 + 0.12, h * 0.13, 1);
    branch(w * 0.68, h * 0.91, -Math.PI / 2 - 0.12, h * 0.13, 1);
    segs.current = out;
  };

  const canvasRef = useCanvasScene({
    onResize: (s) => grow(s.w, s.h),
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = BASALT;
      ctx.fillRect(0, 0, w, h);
      const list = segs.current;
      const p = s.pointer;
      const g = s.reduced ? 1 : progress.current;
      const n = Math.min(list.length, Math.floor(g * list.length));
      for (let i = 0; i < n; i++) {
        const seg = list[i];
        const sway = Math.sin(t * 0.9 + seg.depth * 1.3 + i * 0.05) * seg.depth * 0.7;
        const dx = (seg.x1 + seg.x2) / 2 - p.x;
        const dy = (seg.y1 + seg.y2) / 2 - p.y;
        const near = Math.exp(-(dx * dx + dy * dy) / 22000);
        ctx.strokeStyle = seg.shelf
          ? "rgba(221,217,204," + (0.55 + near * 0.45) + ")"
          : "rgba(221,217,204," +
            (0.28 + (1 - seg.depth / 8) * 0.4 + near * 0.3) +
            ")";
        ctx.lineWidth = seg.shelf ? 2 : Math.max(0.6, 4.5 - seg.depth * 0.6);
        ctx.beginPath();
        ctx.moveTo(seg.x1 + sway * 0.4, seg.y1);
        ctx.lineTo(seg.x2 + sway, seg.y2 + near * -3);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(221,217,204,.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, h * 0.91);
      ctx.lineTo(w * 0.92, h * 0.91);
      ctx.stroke();
    },
  });

  useScrollBind(canvasRef, progress, { enabled: scrollBound });

  return <canvas ref={canvasRef} aria-label={label} />;
}

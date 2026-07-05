"use client";

import { useRef } from "react";
import { useCanvasScene } from "./useCanvasScene";

const STONE = "#E4E2DB";

interface Band {
  col: [number, number, number];
  seed: number;
  thick: number;
}

/**
 * Category 03, Cabinets and sideboards. Ninety horizontal bands inside an
 * outlined cabinet rectangle with two oak feet. Band colours interpolate amber,
 * rose, smoke, sea, amber. Bands drift slowly; the band nearest the cursor's y
 * refracts horizontally and brightens. Reads as veneer and lacquer bending
 * light around the hand. Under reduced motion it renders one settled frame.
 */
export default function Strata({ label }: { label: string }) {
  const bands = useRef<Band[]>([]);

  const buildBands = () => {
    if (bands.current.length) return;
    const stops: [number, number, number][] = [
      [201, 123, 61],
      [180, 104, 94],
      [122, 110, 96],
      [94, 122, 107],
      [201, 123, 61],
    ];
    const out: Band[] = [];
    for (let i = 0; i < 90; i++) {
      const u = i / 89;
      const seg = u * (stops.length - 1);
      const k = Math.floor(seg);
      const f = seg - k;
      const a = stops[Math.min(k, stops.length - 1)];
      const b = stops[Math.min(k + 1, stops.length - 1)];
      out.push({
        col: [
          a[0] + (b[0] - a[0]) * f,
          a[1] + (b[1] - a[1]) * f,
          a[2] + (b[2] - a[2]) * f,
        ],
        seed: Math.random() * 10,
        thick: 0.6 + Math.random() * 0.9,
      });
    }
    bands.current = out;
  };

  const canvasRef = useCanvasScene({
    init: buildBands,
    draw: (s) => {
      const { ctx, w, h, t } = s;
      ctx.fillStyle = STONE;
      ctx.fillRect(0, 0, w, h);
      const p = s.pointer;
      const pad = Math.min(w, h) * 0.12;
      const cab = { x: pad, y: pad * 0.8, w: w - pad * 2, h: h - pad * 1.6 };
      const list = bands.current;
      let total = 0;
      for (let i = 0; i < list.length; i++) total += list[i].thick;
      let y = cab.y;
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        const bh = (b.thick / total) * cab.h;
        const mid = y + bh / 2;
        const dy = mid - p.y;
        const refract = Math.exp(-(dy * dy) / 9000) * 26 * Math.sin(b.seed * 7);
        const drift = Math.sin(t * 0.5 + b.seed) * 4;
        const lum =
          1 +
          Math.sin(t * 0.8 + b.seed * 3) * 0.06 +
          Math.exp(-(dy * dy) / 16000) * 0.28;
        ctx.fillStyle =
          "rgb(" +
          Math.min(255, b.col[0] * lum).toFixed(0) +
          "," +
          Math.min(255, b.col[1] * lum).toFixed(0) +
          "," +
          Math.min(255, b.col[2] * lum).toFixed(0) +
          ")";
        ctx.fillRect(cab.x + refract + drift, y, cab.w, bh + 0.6);
        y += bh;
      }
      ctx.strokeStyle = "rgba(30,33,30,.65)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cab.x, cab.y, cab.w, cab.h);
      ctx.fillStyle = "#3A2E24";
      const fw = cab.w * 0.04;
      ctx.fillRect(cab.x + cab.w * 0.08, cab.y + cab.h, fw, pad * 0.35);
      ctx.fillRect(cab.x + cab.w * 0.88, cab.y + cab.h, fw, pad * 0.35);
    },
  });

  return <canvas ref={canvasRef} aria-label={label} />;
}

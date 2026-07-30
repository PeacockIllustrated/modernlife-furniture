"use client";

import { useEffect } from "react";
import { chairs } from "@/lib/chairs";
import { World, makeBody, COLLIDER_INSET } from "@/lib/physics";

/**
 * The render harness for the social reel. Copied into app/ by
 * scripts/render-social.mjs, used, and removed again: it is never part of the
 * site, so there is no dev-only route sitting in production.
 *
 * It exists so the film is made from the real thing. The chairs are the real
 * silhouettes falling through the real solver, and the logo is the exported
 * asset inlined so its own CSS animation can be seeked. Nothing here is a
 * second implementation that could drift from what the site actually does.
 *
 * Time is driven from outside. window.__seek(ms) advances the world to an
 * absolute moment and draws one frame, so the recorder gets exactly the frame
 * it asked for however long the machine took to produce it. Seeking only ever
 * goes forward, which is all a render needs.
 */

const STEP_MS = 1000 / 60;

// The storyboard, in milliseconds.
const RAIN_FROM = 250;
const RAIN_TO = 2500;
const LOGO_AT = 950; // the build starts over the rising heap
const FLOOR_OPENS = 3950;
const DOMAIN_AT = 4600; // the heap is gone, so do not hold on nothing
const END = 6300;

const INKS = [
  "rgba(30,33,30,0.92)",
  "rgba(30,33,30,0.92)",
  "rgba(30,33,30,0.92)",
  "rgba(21,28,24,0.82)",
  "rgba(201,123,61,0.95)",
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

declare global {
  interface Window {
    __seek?: (ms: number) => void;
    __ready?: boolean;
    __end?: number;
  }
}

export default function ReelRender() {
  useEffect(() => {
    const canvas = document.getElementById("reel-canvas") as HTMLCanvasElement;
    const stage = document.getElementById("reel-logo");
    const domain = document.getElementById("reel-domain");
    if (!canvas || !stage || !domain) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // The frame decides the world, not a constant: a square cut has to pile
    // chairs inside 1080 of height, not below it.
    const W = window.innerWidth;
    const H = window.innerHeight;
    const tall = H > W * 1.2;
    canvas.width = W;
    canvas.height = H;

    const copy = document.getElementById("reel-copy");
    if (copy) copy.style.top = tall ? "26%" : "19%";
    stage.style.width = tall ? "78%" : "86%";

    const paths = chairs.map((c) => new Path2D(c.d));
    const rand = rng(4071);
    const world = new World({ width: W, height: H, gravity: 3200, floor: true });
    const meta: { scale: number; ink: string }[] = [];

    // Sized off the frame's short edge so pieces read the same whether this
    // ends up a full-height reel or a square in a grid, and counted off the
    // area so the heap fills either one.
    const unit = Math.min(W, H) * 0.195;
    const total = Math.round((W * H) / (unit * unit * 0.9));

    const spawn = () => {
      const i = Math.floor(rand() * chairs.length);
      const c = chairs[i];
      const scale = (unit * (0.78 + rand() * 0.6)) / c.h;
      const hw = (c.w * scale * COLLIDER_INSET) / 2;
      const hh = (c.h * scale * COLLIDER_INSET) / 2;
      const b = makeBody(
        i,
        hw + rand() * Math.max(1, W - hw * 2),
        -hh - rand() * H * 0.12,
        hw,
        hh,
        (rand() - 0.5) * 1.7,
      );
      b.vx = (rand() - 0.5) * 150;
      b.vy = 300 + rand() * 240;
      b.av = (rand() - 0.5) * 3;
      world.add(b);
      meta.push({ scale, ink: INKS[Math.floor(rand() * INKS.length)] });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < world.bodies.length; i++) {
        const b = world.bodies[i];
        if (b.y - b.hh > H + 400) continue;
        const c = chairs[b.chair];
        const m = meta[i];
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.scale(m.scale, m.scale);
        ctx.translate(-c.w / 2, -c.h / 2);
        ctx.fillStyle = m.ink;
        ctx.fill(paths[b.chair]);
        ctx.restore();
      }
    };

    let steps = 0; // sim steps taken
    let spawned = 0;
    let floorOpen = false;

    const seek = (ms: number) => {
      // Spawn on the same schedule every run, so the heap is the same heap.
      const due = Math.round(
        total * Math.min(1, Math.max(0, (ms - RAIN_FROM) / (RAIN_TO - RAIN_FROM))),
      );
      while (spawned < due) {
        spawn();
        spawned++;
      }
      if (!floorOpen && ms >= FLOOR_OPENS) {
        floorOpen = true;
        world.opts.floor = false;
        world.wakeAll();
        // One shove, so the heap leaves in a single motion.
        for (const b of world.bodies) b.vy += 300;
      }
      const want = Math.round(ms / STEP_MS);
      while (steps < want) {
        world.step();
        steps++;
      }
      draw();

      // The logo's own CSS animation, seeked to the same moment.
      const at = Math.max(0, ms - LOGO_AT);
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = at;
      }
      domain.style.opacity = String(
        Math.min(1, Math.max(0, (ms - DOMAIN_AT) / 450)),
      );
    };

    // Inline the exported logo so its animation can be seeked; an <img> would
    // seal it off behind the image boundary.
    fetch("/logo/house-of-chairs-animated.svg")
      .then((r) => r.text())
      .then((svg) => {
        stage.innerHTML = svg;
        window.__seek = seek;
        window.__end = END;
        window.__ready = true;
      });
  }, []);

  return (
    <div id="reel-stage">
      <canvas id="reel-canvas" />
      <div id="reel-copy">
        <div id="reel-logo" />
        <div id="reel-domain">houseofchairs.co.uk</div>
      </div>
      <style>{`
        html, body { margin: 0; background: #F5F3EF; overflow: hidden; }
        /* The harness lives inside the site's root layout, which always
           applies, so the frame would otherwise carry the header, the
           announcement strip and the footer. Rather than hide them by name and
           hope the list stays right, the stage is taken out of flow and laid
           opaque over the whole viewport. */
        #reel-stage { position: fixed; inset: 0; z-index: 9999;
          background: #F5F3EF; overflow: hidden; }
        #reel-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
        #reel-copy { position: absolute; left: 0; right: 0; top: 26%;
          display: flex; flex-direction: column; align-items: center;
          gap: clamp(30px, 4vh, 64px); }
        /* Enough glow to lift the mark off a chair passing behind it, spread
           wide enough that it never reads as a panel with edges. */
        #reel-logo { width: 78%; margin: 0 auto; filter:
          drop-shadow(0 0 90px #F5F3EF) drop-shadow(0 0 34px #F5F3EF); }
        #reel-logo svg { width: 100%; height: auto; display: block; }
        #reel-domain { font-family: var(--font-montserrat), system-ui, sans-serif;
          font-weight: 500; font-size: 34px; letter-spacing: 0.34em;
          text-transform: uppercase; color: #1E211E; opacity: 0; }
      `}</style>
    </div>
  );
}

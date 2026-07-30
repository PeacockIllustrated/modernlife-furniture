"use client";

import { useEffect, useRef } from "react";
import { chairs } from "@/lib/chairs";
import { World, makeBody, STEP, COLLIDER_INSET } from "@/lib/physics";

/**
 * The splash: chairs rain into the page, pile up while the rest of the site
 * gets ready, then the floor goes and the whole heap drains off the bottom of
 * the screen to reveal it.
 *
 * The overlay itself is server rendered (see Splash), so there is no flash of
 * site before the curtain. This component only takes it over once hydrated and
 * is responsible for ending it. If it never mounts, a CSS animation clears the
 * overlay anyway.
 *
 * Rules it keeps to: at most about two and a half seconds before the floor
 * opens, any input at all skips it, once per session only, and nothing at all
 * under reduced motion.
 */

const PER_TICK = 4; // chairs per spawn, so the page fills rather than drizzles
const SPAWN_EVERY = 0.042; // seconds between spawns
// The logo finishes assembling at about 2.17s, so the floor holds until it has
// landed and had a beat to be read. Any input still cuts the whole thing short.
const MIN_PILE = 2.2; // seconds of piling before the floor may open
const MAX_PILE = 2.5; // seconds after which it opens regardless
const DRAIN = 0.85; // seconds for the heap to clear the bottom of the screen

// The palette, as weights: mostly ink, a few basalt, one in amber per handful.
const INKS = [
  "rgba(30,33,30,0.92)",
  "rgba(30,33,30,0.92)",
  "rgba(30,33,30,0.92)",
  "rgba(21,28,24,0.8)",
  "rgba(201,123,61,0.95)",
];

/** Deterministic noise, so the pile is the same shape every time it is tuned. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default function SplashCanvas({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const root = document.getElementById("splash");
    if (!canvas || !root) return;

    const finish = () => {
      root.dataset.state = "gone";
      document.documentElement.classList.remove("splash-locked");
      try {
        sessionStorage.setItem("hoc-splash", "1");
      } catch {
        // A blocked storage is not a reason to fail; the splash just repeats.
      }
      onDone?.();
    };

    // Anything the visitor does outranks the animation.
    if (
      root.dataset.state === "gone" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      finish();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    size();

    const paths = chairs.map((c) => new Path2D(c.d));
    const rand = rng(20260729);
    const world = new World({ width: w, height: h, gravity: 3400, floor: true });

    // Chairs are sized off the smaller edge, and the count off the area, so a
    // phone gets a heap of the same visual weight as a desktop rather than a
    // swarm of specks: fewer chairs, drawn larger.
    const unit = Math.max(58, Math.min(w, h) * 0.13);
    // Enough chairs to cover the screen once over at that size, so a tall
    // narrow phone and a wide desktop both end up genuinely full.
    const maxBodies = Math.max(
      40,
      Math.min(140, Math.round((w * h) / (unit * unit * 0.9))),
    );

    let spawned = 0;
    let sinceSpawn = 0;
    let elapsed = 0;
    let opened = 0; // when the floor went, in seconds
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    // The page tells us when it is ready; the clamps decide the rest.
    let ready = document.readyState === "complete";
    const onReady = () => {
      ready = true;
    };
    window.addEventListener("load", onReady, { once: true });

    const meta: { scale: number; ink: string }[] = [];

    const spawn = () => {
      const i = Math.floor(rand() * chairs.length);
      const c = chairs[i];
      const scale = (unit * (0.8 + rand() * 0.55)) / c.h;
      const hw = (c.w * scale * COLLIDER_INSET) / 2;
      const hh = (c.h * scale * COLLIDER_INSET) / 2;
      const b = makeBody(
        i,
        hw + rand() * Math.max(1, w - hw * 2),
        // Just above the fold and already moving: the pile has to build
        // inside a second and a half, so nothing is dropped from a height.
        -hh - rand() * h * 0.14,
        hw,
        hh,
        (rand() - 0.5) * 1.6,
      );
      b.vx = (rand() - 0.5) * 160;
      b.vy = 320 + rand() * 260;
      b.av = (rand() - 0.5) * 3;
      world.add(b);
      meta.push({ scale, ink: INKS[Math.floor(rand() * INKS.length)] });
      spawned++;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < world.bodies.length; i++) {
        const b = world.bodies[i];
        if (b.y - b.hh > h + 240) continue;
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

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt;

      if (!opened) {
        sinceSpawn += dt;
        while (sinceSpawn > SPAWN_EVERY && spawned < maxBodies) {
          sinceSpawn -= SPAWN_EVERY;
          for (let k = 0; k < PER_TICK && spawned < maxBodies; k++) spawn();
        }
        const full = spawned >= maxBodies;
        if (elapsed > MAX_PILE || (ready && full && elapsed > MIN_PILE)) {
          world.opts.floor = false;
          world.wakeAll();
          // A shove downwards, so the heap clears the screen in one motion
          // rather than trickling out of frame.
          for (const b of world.bodies) b.vy += 260;
          opened = elapsed;
          root.dataset.state = "draining";
        }
      }

      acc += dt;
      let steps = 0;
      while (acc >= STEP && steps < 5) {
        world.step();
        acc -= STEP;
        steps++;
      }
      draw();

      if (opened && elapsed - opened > DRAIN) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Any intent to get on with it ends the splash immediately.
    const skip = () => {
      cancelAnimationFrame(raf);
      finish();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    root.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    window.addEventListener("resize", size);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("resize", size);
      window.removeEventListener("load", onReady);
      document.documentElement.classList.remove("splash-locked");
    };
  }, [onDone]);

  return <canvas ref={canvasRef} className="splash-canvas" aria-hidden="true" />;
}

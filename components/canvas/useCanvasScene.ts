"use client";

import { useEffect, useRef } from "react";

/**
 * Shared lifecycle for every generative visual on the site.
 *
 * It owns the parts that are identical across the five canvases so the
 * renderers themselves stay about drawing: DPR-capped sizing (cap 2), resize,
 * an IntersectionObserver that pauses the loop off-screen, pointer mapping from
 * the window into canvas-local coordinates, and the reduced-motion contract of
 * a single meaningful frame instead of a running loop.
 *
 * The draw callback receives a live `CanvasScene`. Renderers read `reduced` to
 * decide their still frame, and `active` is already handled by the loop (draw
 * is only called while on-screen).
 */

export interface ScenePointer {
  /** canvas-local x, or a large negative when the pointer is away */
  x: number;
  y: number;
  /** whether the pointer is currently within the canvas bounds */
  inside: boolean;
}

export interface CanvasScene {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  /** CSS-pixel width and height (context is pre-scaled by dpr) */
  w: number;
  h: number;
  dpr: number;
  /** seconds-ish clock, advanced only while on-screen */
  t: number;
  active: boolean;
  reduced: boolean;
  pointer: ScenePointer;
}

export interface CanvasSceneOptions {
  /** draw one frame */
  draw: (scene: CanvasScene) => void;
  /** run once after first sizing, before the first draw */
  init?: (scene: CanvasScene) => void;
  /** recompute geometry on resize (grove regrows, strata re-lays out) */
  onResize?: (scene: CanvasScene) => void;
  /** clock increment per frame; defaults to the concept's 0.016 */
  dt?: number;
}

const AWAY = -9999;

export function useCanvasScene(options: CanvasSceneOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Keep the latest callbacks without re-running the effect each render.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene: CanvasScene = {
      canvas,
      ctx,
      w: 0,
      h: 0,
      dpr: 1,
      t: 0,
      active: false,
      reduced,
      pointer: { x: AWAY, y: AWAY, inside: false },
    };

    // Latest window-space pointer; mapped to local each frame so it stays
    // correct through scroll without listening to scroll directly.
    const client = { x: AWAY, y: AWAY };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      scene.dpr = Math.min(window.devicePixelRatio || 1, 2);
      scene.w = r.width;
      scene.h = r.height;
      canvas.width = Math.round(r.width * scene.dpr);
      canvas.height = Math.round(r.height * scene.dpr);
      ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
      optionsRef.current.onResize?.(scene);
      // Under reduced motion the loop never runs, so redraw the still here.
      if (reduced) optionsRef.current.draw(scene);
    };

    optionsRef.current.init?.(scene);
    resize();

    const onResizeWindow = () => resize();
    window.addEventListener("resize", onResizeWindow);

    const io = new IntersectionObserver(
      (entries) => {
        scene.active = entries[0].isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      client.x = e.clientX;
      client.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    // When the pointer leaves the window entirely, let the visual return to idle.
    const onLeave = () => {
      client.x = AWAY;
      client.y = AWAY;
    };
    window.addEventListener("pointerout", onLeave, { passive: true });

    let raf = 0;
    const dt = optionsRef.current.dt ?? 0.016;

    const frame = () => {
      if (scene.active) {
        const r = canvas.getBoundingClientRect();
        scene.pointer.x = client.x - r.left;
        scene.pointer.y = client.y - r.top;
        scene.pointer.inside =
          client.x >= r.left &&
          client.x <= r.right &&
          client.y >= r.top &&
          client.y <= r.bottom;
        scene.t += dt;
        optionsRef.current.draw(scene);
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      // One meaningful frame, then hold. resize() already drew once.
      optionsRef.current.draw(scene);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResizeWindow);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      io.disconnect();
    };
  }, []);

  return canvasRef;
}

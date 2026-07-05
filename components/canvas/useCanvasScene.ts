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
      // Redraw the current frame: resizing reallocates and clears the backing
      // store, and the animation loop may still be deferred, so without this the
      // panel would flash blank. Skipped at zero size to avoid NaN geometry.
      if (scene.w > 0 && scene.h > 0) optionsRef.current.draw(scene);
    };

    optionsRef.current.init?.(scene);
    resize();

    const onResizeWindow = () => resize();
    window.addEventListener("resize", onResizeWindow);

    // Catch container-driven size changes that the window resize event misses
    // (a font swap reflowing siblings, a lazy image loading, the mobile URL bar).
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

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
    // When the pointer leaves the window entirely (relatedTarget null), let the
    // visual return to idle. Boundary crossings between elements keep a
    // relatedTarget and are ignored, so interactions do not flicker.
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget !== null) return;
      client.x = AWAY;
      client.y = AWAY;
    };
    window.addEventListener("pointerout", onLeave, { passive: true });

    let raf = 0;
    const dt = optionsRef.current.dt ?? 0.016;

    const frame = () => {
      if (scene.active && scene.w > 0 && scene.h > 0) {
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

    // The initial resize() above already painted one static frame, so the panel
    // is never blank. Reduced motion stops there.

    // Defer the animation loop until the page has loaded and gone idle, so the
    // canvases do not compete with the critical render for the main thread.
    let idleId = 0;
    let cancelled = false;
    const startLoop = () => {
      if (!cancelled) raf = requestAnimationFrame(frame);
    };
    const scheduleStart = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(startLoop, { timeout: 800 });
      } else {
        idleId = window.setTimeout(startLoop, 300);
      }
    };
    const onLoad = () => scheduleStart();

    if (!reduced) {
      if (document.readyState === "complete") scheduleStart();
      else window.addEventListener("load", onLoad, { once: true });
    }

    // Repaint once the web fonts are ready, so in-canvas annotation (the
    // conservator's notes, the ring labels) is not left in the fallback font,
    // which matters under reduced motion where the loop never repaints.
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        if (!cancelled && scene.w > 0 && scene.h > 0) {
          optionsRef.current.draw(scene);
        }
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (idleId) {
        if (typeof window.cancelIdleCallback === "function")
          window.cancelIdleCallback(idleId);
        else clearTimeout(idleId);
      }
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", onResizeWindow);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return canvasRef;
}

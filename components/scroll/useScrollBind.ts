"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Binds a build sequence to scroll progress. Writes 0..1 into the provided
 * `progress` ref as the trigger element passes through the viewport, so
 * scrubbing the page scrubs the build (the chair assembling, the grove
 * growing). Under reduced motion it pins progress at 1 and creates no trigger,
 * leaving the visual at its finished still.
 */
export function useScrollBind(
  elementRef: RefObject<HTMLElement | null>,
  progress: RefObject<number>,
  opts?: { start?: string; end?: string; enabled?: boolean },
) {
  const start = opts?.start ?? "top bottom";
  const end = opts?.end ?? "top top";
  const enabled = opts?.enabled ?? true;

  useEffect(() => {
    // Not scroll-bound (a decorative header band): hold at the finished state.
    if (!enabled) {
      progress.current = 1;
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      progress.current = 1;
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const el = elementRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
      onRefresh: (self) => {
        progress.current = self.progress;
      },
    });
    return () => st.kill();
  }, [elementRef, progress, start, end, enabled]);
}

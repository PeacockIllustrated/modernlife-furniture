"use client";

import { useEffect } from "react";

/**
 * Session 1 reveal: adds the `in` class to every `.reveal` element as it
 * enters the viewport, matching the concept's 26px rise. Session 2 replaces
 * this with GSAP entrance choreography. Under prefers-reduced-motion the CSS
 * already renders `.reveal` at rest, so this observer is a no-op there.
 */
export default function RevealObserver() {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduced) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      // Reveal as soon as any part crosses ~12% up from the bottom edge. Using
      // isIntersecting with a root margin, rather than a ratio threshold, means
      // sections taller than the viewport (the provenance block on mobile) still
      // reveal instead of being stranded below the ratio and staying invisible.
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}

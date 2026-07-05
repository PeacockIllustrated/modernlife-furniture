"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth scroll driven by the GSAP ticker, with ScrollTrigger kept in
 * sync so scroll-linked build sequences (session 2) scrub against real
 * progress. When the visitor prefers reduced motion we fall back to native
 * scrolling and leave the page still.
 */
export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);
  const [reduced, setReduced] = useState(false);

  // Read the preference once on the client, then remount with smoothing off.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keep ScrollTrigger updated on every Lenis scroll frame.
  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (reduced) return;
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [reduced]);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      key={reduced ? "reduced" : "smooth"}
      options={{
        autoRaf: false,
        smoothWheel: !reduced,
        syncTouch: false,
        duration: 1.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}

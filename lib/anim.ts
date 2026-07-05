/**
 * Small, shared animation maths. Kept pure so the canvas renderers and the
 * scene hook draw from one set of easing primitives.
 */

export function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}

/** Smoothstep, matching the concept's `ease`. */
export function ease(v: number): number {
  const c = clamp(v, 0, 1);
  return c * c * (3 - 2 * c);
}

export function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

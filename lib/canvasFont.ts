/**
 * next/font self-hosts under a hashed family name exposed via a CSS variable.
 * Canvas 2D cannot read CSS variables in `ctx.font`, so we resolve the concrete
 * family from the variable at runtime and hand back a ready font string. Used
 * for all in-canvas annotation (the conservator's notes, and later the ring
 * labels), keeping them in Spline Sans Mono rather than a generic monospace.
 */
export function monoCanvasFont(size: number, weight: number = 400): string {
  if (typeof window === "undefined") {
    return `${weight} ${size}px monospace`;
  }
  const family = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-spline-mono")
    .trim();
  return `${weight} ${size}px ${family || "ui-monospace"}, monospace`;
}

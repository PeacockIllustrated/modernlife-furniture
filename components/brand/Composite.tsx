/**
 * The hero figure: a progression, not a picture.
 *
 * One element is drawn fourteen times: the section of a seat, reduced to the
 * only two facts a chair has, a plane you rest on and a rake that holds you.
 * No legs, no frame, no object. Each repeat steps up and to the right, shrinks
 * a little, opens its rake a little and softens its corner a little, so the
 * family sweeps from upright and tight to low and open across the panel.
 *
 * What reads is the transformation rather than any one section: a stack, a
 * flight, a run of variations on a single idea, which is what a room of
 * one-of-one chairs is. One repeat is drawn in the brand amber so the eye has
 * somewhere to land, and so a single piece surfaces from the run.
 *
 * Nothing here is a maker's chair, or a chair at all: the parameters describe
 * proportion and rake, and the result is abstract by construction. The figure
 * is sized in CSS and runs off the right of the panel, so it composes as a
 * fragment at every aspect the hero takes rather than being squeezed into
 * each one.
 */

const N = 14;
const VIEW = { w: 660, h: 380 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const n = (v: number) => Number(v.toFixed(3));

/**
 * One section, with its corner at the local origin: down the rake, round the
 * corner, out along the plane. Open at both ends, so it never closes into a
 * shape.
 */
function section(rake: number, rise: number, radius: number, run: number): string {
  return [
    `M${n(-rake)} ${n(-rise)}`,
    // the rake falling into the corner, straight at the top, easing at the foot
    `C${n(-rake * 0.44)} ${n(-rise * 0.54)}`,
    `${n(-radius * 0.16)} ${n(-radius * 1.7)}`,
    `0 ${n(-radius)}`,
    // the corner itself
    `Q0 0 ${n(radius)} 0`,
    // the plane
    `L${n(run)} 0`,
  ].join(" ");
}

interface Step {
  d: string;
  x: number;
  y: number;
  scale: number;
  ink: number;
}

/**
 * The run. Every value moves monotonically with t, so it reads as one
 * continuous transformation rather than fourteen separate decisions; only the
 * line weight alternates, which is what gives the field depth.
 */
const RUN: Step[] = Array.from({ length: N }, (_, i) => {
  const t = i / (N - 1);
  return {
    d: section(
      lerp(0.08, 0.3, t), // rake, opening as it rises
      lerp(0.98, 0.74, t), // rise, shortening
      lerp(0.14, 0.28, t), // corner, softening
      lerp(0.82, 0.5, t), // plane, drawing in
    ),
    x: lerp(146, 486, t),
    y: lerp(358, 96, t),
    scale: lerp(330, 232, t),
    // Alternating weights, with the run fading as it climbs.
    ink: (i % 2 === 0 ? 0.34 : 0.17) * lerp(1, 0.62, t),
  };
});

// The repeat drawn in amber, taken from inside the run rather than its edge.
const LEAD = 5;

export default function Composite() {
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {RUN.map((s, i) => {
        const lead = i === LEAD;
        return (
          <path
            key={i}
            className={lead ? "fig-line fig-lead" : "fig-line fig-step"}
            d={s.d}
            transform={`translate(${n(s.x)} ${n(s.y)}) scale(${n(s.scale)})`}
            // The transform carries the scale, so each stroke divides its
            // weight back down to land at a hairline on the page.
            strokeWidth={(lead ? 1.35 : 1.1) / s.scale}
            strokeOpacity={lead ? undefined : s.ink}
            pathLength={100}
            data-draw=""
            style={{ animationDelay: `${(i * 0.055).toFixed(3)}s` }}
          />
        );
      })}
    </svg>
  );
}

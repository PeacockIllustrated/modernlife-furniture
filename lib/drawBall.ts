import { clamp, ease } from "./anim";

/**
 * The ball chair, abstracted: a lathe survey.
 *
 * The chair is rebuilt as a stack of latitude sections, open elliptical hoops
 * whose broken mouths line up into the vivid orange cavity, so the object
 * reads as a topography of itself still turning on the axis that made it.
 * Volume is carried by hoop density and depth-graded stroke alpha; the mouth
 * is genuinely absent line, punched through to the stone; the cavity is lined
 * with receding orange arcs over a low-alpha warmth fill, kept deliberately
 * vivid (see DESIGN.md, do not desaturate).
 *
 * This remains the single chair renderer: pure (context in, no React), and
 * any improvement to the chair lands here and nowhere else. BallChair.tsx is
 * its only consumer; the Restoration room no longer draws the chair.
 */

export const LATHE_SLICES = 17;

const TAU = Math.PI * 2;
const TILT = 0.24; /* section ellipse ry = rx * TILT      */
const MOUTH_V = -0.03; /* cavity centre latitude, +up         */
const MOUTH_SPAN = 0.78; /* cavity half-height in latitude      */
const MOUTH_HALF = 1.15; /* max gap half-angle, radians         */
const FACE_CLAMP = 0.9; /* the mouth never leaves the front    */

/** Latitude fraction (+up) of shell slice i, from -0.94 to +0.94. */
export function sliceLatitude(i: number): number {
  return -0.94 + (i * 1.88) / (LATHE_SLICES - 1);
}

export interface LatheChairOptions {
  cx: number;
  cy: number;
  /** shell radius in CSS px */
  R: number;
  /** scene clock, seconds-ish */
  t: number;
  /** per-slice mouth azimuths in radians, length LATHE_SLICES */
  phis: readonly number[];
  /** assembly progress 0..1; 1 is the finished chair */
  build: number;
}

function ink(a: number): string {
  return "rgba(30,33,30," + a.toFixed(3) + ")";
}

/** Vivid cavity ramp, #F0812F to #DC5E1F to #98380F. */
function cavityColour(u: number, a: number): string {
  const stops: [number, number, number][] = [
    [240, 129, 47],
    [220, 94, 31],
    [152, 56, 15],
  ];
  const cu = clamp(u, 0, 1);
  const seg = cu < 0.55 ? 0 : 1;
  const f = seg === 0 ? cu / 0.55 : (cu - 0.55) / 0.45;
  const c0 = stops[seg];
  const c1 = stops[seg + 1];
  const r = Math.round(c0[0] + (c1[0] - c0[0]) * f);
  const g = Math.round(c0[1] + (c1[1] - c0[1]) * f);
  const b = Math.round(c0[2] + (c1[2] - c0[2]) * f);
  return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
}

function easeOutCubic(x: number): number {
  const c = clamp(x, 0, 1);
  return 1 - (1 - c) * (1 - c) * (1 - c);
}

function hoopX(cx: number, rx: number, phi: number): number {
  return cx + rx * Math.sin(phi);
}
function hoopY(yc: number, rx: number, phi: number): number {
  return yc + rx * TILT * Math.cos(phi);
}

/**
 * Stroke an azimuth range of a tilted hoop in ~10 chunks per revolution, each
 * chunk's alpha graded by how much it faces the viewer (phi = 0 is the front),
 * which is what carries the roundness without any fill.
 */
function strokeHoopRange(
  ctx: CanvasRenderingContext2D,
  cx: number,
  yc: number,
  rx: number,
  a0: number,
  a1: number,
  baseAlpha: number,
  mul: number,
): void {
  const total = a1 - a0;
  if (total <= 0.002) return;
  const chunks = Math.max(1, Math.round(total / (TAU / 10)));
  for (let c = 0; c < chunks; c++) {
    const c0 = a0 + (total * c) / chunks;
    const c1 = a0 + (total * (c + 1)) / chunks;
    const mid = (c0 + c1) / 2;
    const facing = (Math.cos(mid) + 1) / 2;
    ctx.strokeStyle = ink(baseAlpha * (0.35 + 0.65 * facing) * mul);
    ctx.lineWidth = Math.cos(mid) > 0 ? 1.3 : 1;
    const steps = Math.max(6, Math.ceil((64 * (c1 - c0)) / TAU));
    ctx.beginPath();
    for (let k = 0; k <= steps; k++) {
      const phi = c0 + ((c1 - c0) * k) / steps;
      if (k === 0) ctx.moveTo(hoopX(cx, rx, phi), hoopY(yc, rx, phi));
      else ctx.lineTo(hoopX(cx, rx, phi), hoopY(yc, rx, phi));
    }
    ctx.stroke();
  }
}

/** A plain flat-alpha arc along a hoop, used for stance hoops and cavity lining. */
function strokeFlatArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  yc: number,
  rx: number,
  a0: number,
  a1: number,
  style: string,
  lw: number,
): void {
  if (a1 - a0 <= 0.002) return;
  ctx.strokeStyle = style;
  ctx.lineWidth = lw;
  const steps = Math.max(8, Math.ceil((48 * (a1 - a0)) / TAU));
  ctx.beginPath();
  for (let k = 0; k <= steps; k++) {
    const phi = a0 + ((a1 - a0) * k) / steps;
    if (k === 0) ctx.moveTo(hoopX(cx, rx, phi), hoopY(yc, rx, phi));
    else ctx.lineTo(hoopX(cx, rx, phi), hoopY(yc, rx, phi));
  }
  ctx.stroke();
}

/** The warm pen tip riding the live end of a compass stroke during the build. */
function penTips(
  ctx: CanvasRenderingContext2D,
  cx: number,
  yc: number,
  rx: number,
  u: number,
  mul: number,
): void {
  if (u <= 0 || u >= 1) return;
  ctx.fillStyle = "rgba(201,123,61," + (0.9 * mul).toFixed(3) + ")";
  for (const phi of [Math.PI - u * Math.PI, Math.PI + u * Math.PI]) {
    ctx.beginPath();
    ctx.arc(hoopX(cx, rx, phi), hoopY(yc, rx, phi), 2.2, 0, TAU);
    ctx.fill();
  }
}

interface StanceHoop {
  y: number;
  rx: number;
  alpha: number;
  lw: number;
  start: number;
  dur: number;
}

export function drawLatheChair(
  ctx: CanvasRenderingContext2D,
  o: LatheChairOptions,
): void {
  const { cx, cy, R, t } = o;
  const e = clamp(o.build, 0, 1);
  ctx.lineCap = "round";

  /* the lathe axis, present from the first frame */
  ctx.strokeStyle = ink(0.12);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - R * 1.15);
  ctx.lineTo(cx, cy + R * 1.6);
  ctx.stroke();

  const gapScale = ease((e - 0.72) / 0.28);

  /* ---- stance: seat plate, stem and base restated as turned sections ---- */
  const stance: StanceHoop[] = [];
  for (let k = 0; k < 3; k++) {
    stance.push({
      y: cy + R * (1.52 - k * 0.015),
      rx: R * [0.42, 0.3, 0.17][k],
      alpha: [0.5, 0.25, 0.15][k],
      lw: [1.3, 1, 1][k],
      start: k * 0.02,
      dur: 0.14,
    });
  }
  for (let j = 0; j < 4; j++) {
    stance.push({
      y: cy + R * (1.02 + j * 0.12),
      rx: R * [0.1, 0.105, 0.12, 0.16][j],
      alpha: 0.35,
      lw: 1.2,
      start: 0.12 + (3 - j) * 0.03,
      dur: 0.12,
    });
  }
  stance.push({
    y: cy + R * 0.96,
    rx: R * 0.3,
    alpha: 0.4,
    lw: 1.1,
    start: 0.24,
    dur: 0.1,
  });

  let stancePresence = 0;
  for (const hoop of stance) {
    const u = easeOutCubic((e - hoop.start) / hoop.dur);
    stancePresence = Math.max(stancePresence, u);
    if (u <= 0) continue;
    const yc = hoop.y + R * 0.1 * (1 - u);
    const mul = 0.2 + 0.8 * u;
    if (u >= 1) {
      strokeFlatArc(ctx, cx, yc, hoop.rx, 0, TAU, ink(hoop.alpha), hoop.lw);
    } else {
      strokeFlatArc(
        ctx,
        cx,
        yc,
        hoop.rx,
        Math.PI - u * Math.PI,
        Math.PI + u * Math.PI,
        ink(hoop.alpha * mul),
        hoop.lw,
      );
      penTips(ctx, cx, yc, hoop.rx, u, mul);
    }
  }

  /* floor shadow, two flat stroked ellipses, arriving with the base */
  if (stancePresence > 0) {
    for (const [srx, sa] of [
      [R * 0.55, 0.1],
      [R * 0.4, 0.06],
    ] as const) {
      ctx.strokeStyle = ink(sa * stancePresence);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy + R * 1.6, srx, srx * 0.1, 0, 0, TAU);
      ctx.stroke();
    }
  }

  /* ---- shell slice progress, needed before atmosphere and lens ---- */
  const shellU: number[] = [];
  let shellAvg = 0;
  for (let i = 0; i < LATHE_SLICES; i++) {
    const start = 0.25 + (i / (LATHE_SLICES - 1)) * 0.37;
    const u = easeOutCubic((e - start) / 0.18);
    shellU.push(u);
    shellAvg += u / LATHE_SLICES;
  }

  /* hatched shade, three thin arcs lower left, and the firming silhouette */
  if (shellAvg > 0.05) {
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = ink((0.05 - k * 0.012) * shellAvg);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, R * (0.9 - k * 0.055), Math.PI * 0.55, Math.PI * 1.12);
      ctx.stroke();
    }
    ctx.strokeStyle = ink(0.15 * shellAvg);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.stroke();
  }

  /* ---- the mouth: per-slice gap geometry ---- */
  const gapOf = (i: number): number => {
    const v = sliceLatitude(i);
    const du = (v - MOUTH_V) / MOUTH_SPAN;
    if (Math.abs(du) >= 1) return 0;
    return (
      MOUTH_HALF *
      Math.sqrt(Math.max(0, 1 - du * du)) *
      gapScale *
      (1 + 0.03 * Math.sin(t * 0.6 + i * 0.5))
    );
  };
  const faceOf = (i: number): number =>
    clamp(o.phis[i] ?? 0, -FACE_CLAMP, FACE_CLAMP);

  /* warmth fill in the mouth lens, a fill strictly beneath the line work,
     with the warm rim light on the upper opening edge (the drawBall grafts) */
  if (gapScale > 0.02) {
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    let topSlice = -1;
    for (let i = 0; i < LATHE_SLICES; i++) {
      if (shellU[i] < 1) continue;
      const g = gapOf(i);
      if (g < 0.03) continue;
      const v = sliceLatitude(i);
      const rx = R * Math.sqrt(Math.max(0.002, 1 - v * v));
      const yc = cy - v * R;
      const face = faceOf(i);
      left.push([hoopX(cx, rx, face - g), hoopY(yc, rx, face - g)]);
      right.push([hoopX(cx, rx, face + g), hoopY(yc, rx, face + g)]);
      topSlice = i;
    }
    if (left.length > 2) {
      let mx = 0;
      let my = 0;
      for (const [x, y] of [...left, ...right]) {
        mx += x / (left.length + right.length);
        my += y / (left.length + right.length);
      }
      const grad = ctx.createRadialGradient(mx, my, R * 0.05, mx, my, R * 0.85);
      grad.addColorStop(0, "rgba(240,129,47," + (0.3 * gapScale).toFixed(3) + ")");
      grad.addColorStop(0.6, "rgba(220,94,31," + (0.16 * gapScale).toFixed(3) + ")");
      grad.addColorStop(1, "rgba(152,56,15,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(left[0][0], left[0][1]);
      for (let k = 1; k < left.length; k++) ctx.lineTo(left[k][0], left[k][1]);
      for (let k = right.length - 1; k >= 0; k--)
        ctx.lineTo(right[k][0], right[k][1]);
      ctx.closePath();
      ctx.fill();

      /* rim light where the opening catches the room */
      if (topSlice >= 0) {
        const v = sliceLatitude(topSlice);
        const rx = R * Math.sqrt(Math.max(0.002, 1 - v * v));
        strokeFlatArc(
          ctx,
          cx,
          cy - v * R,
          rx,
          faceOf(topSlice) - gapOf(topSlice) * 0.85,
          faceOf(topSlice) + gapOf(topSlice) * 0.85,
          "rgba(255,190,140," + (0.5 * gapScale).toFixed(3) + ")",
          1.4,
        );
      }
    }
  }

  /* ---- the seventeen shell hoops ---- */
  for (let i = 0; i < LATHE_SLICES; i++) {
    const u = shellU[i];
    if (u <= 0) continue;
    const v = sliceLatitude(i);
    const rx = R * Math.sqrt(Math.max(0.002, 1 - v * v));
    const yc = cy - v * R + R * 0.1 * (1 - u);
    const baseAlpha = 0.22 + 0.3 * (1 - Math.abs(v));
    const mul = 0.2 + 0.8 * u;

    if (u < 1) {
      strokeHoopRange(
        ctx,
        cx,
        yc,
        rx,
        Math.PI - u * Math.PI,
        Math.PI + u * Math.PI,
        baseAlpha,
        mul,
      );
      penTips(ctx, cx, yc, rx, u, mul);
      continue;
    }

    const g = gapOf(i);
    const face = faceOf(i);
    if (g > 0.01) {
      /* the hoop runs the long way round; the mouth is absent line */
      strokeHoopRange(ctx, cx, yc, rx, face + g, face + TAU - g, baseAlpha, 1);

      /* cut faces: the shell wall in section at each gap end */
      const tickA = 0.5 * Math.min(1, gapScale * 1.5);
      ctx.strokeStyle = ink(tickA);
      ctx.lineWidth = 1.2;
      for (const phi of [face - g, face + g]) {
        ctx.beginPath();
        ctx.moveTo(hoopX(cx, rx, phi), hoopY(yc, rx, phi));
        ctx.lineTo(hoopX(cx, rx * 0.9, phi), hoopY(yc, rx * 0.9, phi));
        ctx.stroke();
      }

      /* cavity lining: two receding arcs, darkening with distance from the
         mouth's centre latitude; the saturated heart of the room */
      const uv = Math.abs((v - MOUTH_V) / MOUTH_SPAN);
      strokeFlatArc(
        ctx,
        cx,
        yc,
        rx * 0.86,
        face - g * 0.92,
        face + g * 0.92,
        cavityColour(uv, 0.85 * gapScale),
        2,
      );
      strokeFlatArc(
        ctx,
        cx,
        yc,
        rx * 0.62,
        face - g * 0.7,
        face + g * 0.7,
        cavityColour(uv + 0.3, 0.55 * gapScale),
        1.3,
      );
      /* the seat, one warmer arc low in the cavity */
      if (v >= -0.4 && v <= -0.2) {
        strokeFlatArc(
          ctx,
          cx,
          yc,
          rx * 0.45,
          face - g * 0.5,
          face + g * 0.5,
          "rgba(231,111,38," + (0.9 * gapScale).toFixed(3) + ")",
          2.2,
        );
      }
    } else {
      strokeHoopRange(ctx, cx, yc, rx, 0, TAU, baseAlpha, 1);
    }
  }
}

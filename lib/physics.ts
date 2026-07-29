/**
 * A small rigid-body solver, enough for a pile of chairs and nothing more.
 *
 * Bodies are oriented boxes. The silhouettes are drawn on top of their boxes,
 * inset a little (see COLLIDER_INSET), so pieces interlock slightly instead of
 * resting on invisible air, which is what sells a heap of irregular shapes as
 * a heap rather than as floating stickers.
 *
 * The method is the standard one: separating-axis test for the collision,
 * reference-face clipping for the contact points, then sequential impulses
 * with accumulated normal impulses and Baumgarte position bias. Contacts are
 * matched to the previous frame by feature id so their impulses can be warm
 * started, which is what makes a stack settle instead of shivering.
 *
 * No dependency, no DOM: this runs in the splash at 60fps and in a headless
 * page when the hero's resting pile is baked.
 */

export interface Body {
  /** Centre of mass, in world units (pixels). */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Orientation in radians, and angular velocity. */
  angle: number;
  av: number;
  /** Half extents of the collision box. */
  hw: number;
  hh: number;
  invMass: number;
  invI: number;
  /** Index into the chair set, and the scale its silhouette is drawn at. */
  chair: number;
  /** Frames this body has been slow enough to be considered at rest. */
  still: number;
  sleeping: boolean;
}

export interface WorldOptions {
  width: number;
  height: number;
  gravity: number;
  /** Set false to open the floor and let everything fall out. */
  floor: boolean;
}

interface Contact {
  a: Body;
  b: Body | null; // null means a static boundary
  nx: number;
  ny: number;
  px: number;
  py: number;
  separation: number;
  /** Stable identity for this contact point, so impulses can be warm started. */
  key: string;
  pn: number; // accumulated normal impulse
  pt: number; // accumulated tangent impulse
}

/** The box is smaller than the drawing, so silhouettes overlap as they settle. */
export const COLLIDER_INSET = 0.84;

const RESTITUTION = 0.06;
const FRICTION = 0.62;
const ITERATIONS = 12;
const SLOP = 0.35;
const BIAS = 0.22;
const SLEEP_SPEED = 6;
const SLEEP_SPIN = 0.12;
const SLEEP_FRAMES = 34;
// A body may not cross more than about a small chair's depth in one step.
const MAX_SPEED = 1500;

export const STEP = 1 / 60;

export function makeBody(
  chair: number,
  x: number,
  y: number,
  hw: number,
  hh: number,
  angle: number,
): Body {
  // Uniform density, so a wide chair carries more mass than a narrow one.
  const mass = hw * hh * 4 * 0.0016;
  const inertia = (mass * (hw * hw * 4 + hh * hh * 4)) / 12;
  return {
    x, y, vx: 0, vy: 0, angle, av: 0, hw, hh,
    invMass: 1 / mass,
    invI: 1 / inertia,
    chair,
    still: 0,
    sleeping: false,
  };
}

/** The four corners of a body, world space. */
function corners(b: Body): number[] {
  const c = Math.cos(b.angle);
  const s = Math.sin(b.angle);
  const xs = [b.hw, b.hw, -b.hw, -b.hw];
  const ys = [-b.hh, b.hh, b.hh, -b.hh];
  const out: number[] = [];
  for (let i = 0; i < 4; i++) {
    out.push(b.x + xs[i] * c - ys[i] * s, b.y + xs[i] * s + ys[i] * c);
  }
  return out;
}

/**
 * Separating-axis test between two boxes. Returns the axis of least
 * penetration, or null when they are apart.
 */
function sat(a: Body, b: Body): { nx: number; ny: number; depth: number } | null {
  const ca = corners(a);
  const cb = corners(b);
  let best = Infinity;
  let bnx = 0;
  let bny = 0;
  // Both boxes contribute two unique axes; four tests in total.
  for (const [box, other, sign] of [
    [ca, cb, 1],
    [cb, ca, -1],
  ] as const) {
    for (let e = 0; e < 2; e++) {
      const i = e * 2;
      let ax = box[(i + 2) % 8] - box[i];
      let ay = box[(i + 3) % 8] - box[i + 1];
      const len = Math.hypot(ax, ay) || 1;
      // The separating axis is the edge normal.
      const nx = -ay / len;
      const ny = ax / len;
      let minA = Infinity, maxA = -Infinity, minB = Infinity, maxB = -Infinity;
      for (let k = 0; k < 8; k += 2) {
        const pa = box[k] * nx + box[k + 1] * ny;
        const pb = other[k] * nx + other[k + 1] * ny;
        if (pa < minA) minA = pa;
        if (pa > maxA) maxA = pa;
        if (pb < minB) minB = pb;
        if (pb > maxB) maxB = pb;
      }
      const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
      if (overlap <= 0) return null;
      if (overlap < best) {
        best = overlap;
        bnx = nx;
        bny = ny;
      }
      void sign;
    }
  }
  // Whichever box the axis came from, the normal points from a towards b.
  if ((b.x - a.x) * bnx + (b.y - a.y) * bny < 0) {
    bnx = -bnx;
    bny = -bny;
  }
  return { nx: bnx, ny: bny, depth: best };
}

/**
 * The contact points for a pair. Deepest two corners of each box along the
 * collision normal is a coarse manifold, but with two points per pair a stack
 * still resists rotation, which is all this needs.
 */
function manifold(a: Body, b: Body, nx: number, ny: number, depth: number, id: string): Contact[] {
  const out: Contact[] = [];
  const push = (pts: number[], from: Body, s: number, tag: string) => {
    let bestI = 0;
    let bestD = -Infinity;
    let secondI = 0;
    let secondD = -Infinity;
    for (let k = 0; k < 8; k += 2) {
      const d = (pts[k] * nx + pts[k + 1] * ny) * s;
      if (d > bestD) {
        secondD = bestD; secondI = bestI;
        bestD = d; bestI = k;
      } else if (d > secondD) {
        secondD = d; secondI = k;
      }
    }
    for (const [i, t] of [[bestI, "0"], [secondI, "1"]] as const) {
      out.push({
        a, b, nx, ny,
        px: pts[i], py: pts[i + 1],
        separation: -depth,
        key: `${id}:${tag}${t}:${i}`,
        pn: 0, pt: 0,
      });
    }
    void from;
  };
  push(corners(a), a, 1, "a");
  push(corners(b), b, -1, "b");
  return out;
}

export class World {
  bodies: Body[] = [];
  opts: WorldOptions;
  private cache = new Map<string, { pn: number; pt: number }>();

  constructor(opts: WorldOptions) {
    this.opts = opts;
  }

  add(b: Body) {
    this.bodies.push(b);
  }

  /** Everything wakes when the ground goes, or a new body lands on a pile. */
  wakeAll() {
    for (const b of this.bodies) {
      b.sleeping = false;
      b.still = 0;
    }
  }

  step(dt = STEP) {
    const { gravity, width, height, floor } = this.opts;

    for (const b of this.bodies) {
      if (b.sleeping) continue;
      b.vy += gravity * dt;
      // Nothing may move further than roughly its own depth in a step, or it
      // passes through the floor between frames instead of landing on it.
      const speed = Math.hypot(b.vx, b.vy);
      if (speed > MAX_SPEED) {
        b.vx = (b.vx / speed) * MAX_SPEED;
        b.vy = (b.vy / speed) * MAX_SPEED;
      }
    }

    const contacts = this.collect();

    // Warm start from the previous frame's impulses, matched by feature id.
    for (const c of contacts) {
      const prev = this.cache.get(c.key);
      if (!prev) continue;
      c.pn = prev.pn;
      c.pt = prev.pt;
      this.applyImpulse(c, c.pn * c.nx + c.pt * -c.ny, c.pn * c.ny + c.pt * c.nx);
    }

    for (let it = 0; it < ITERATIONS; it++) {
      for (const c of contacts) this.solve(c, dt);
    }

    this.cache.clear();
    for (const c of contacts) this.cache.set(c.key, { pn: c.pn, pt: c.pt });

    for (const b of this.bodies) {
      if (b.sleeping) continue;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.angle += b.av * dt;

      // The walls are hard: nothing leaves through the sides. The floor is
      // optional, and when it goes the pile drains off the bottom.
      if (!floor && b.y - b.hh > height + 200) continue;
      const speed = Math.hypot(b.vx, b.vy);
      if (speed < SLEEP_SPEED && Math.abs(b.av) < SLEEP_SPIN) {
        if (++b.still > SLEEP_FRAMES) b.sleeping = true;
      } else {
        b.still = 0;
      }
    }
    void width;
  }

  private collect(): Contact[] {
    const { width, height, floor } = this.opts;
    const out: Contact[] = [];

    for (let i = 0; i < this.bodies.length; i++) {
      const a = this.bodies[i];
      // Boundaries: the floor and the two walls, as half planes.
      const cs = corners(a);
      for (let k = 0; k < 8; k += 2) {
        const cx = cs[k];
        const cy = cs[k + 1];
        // The normal always points from the body towards the thing it is
        // hitting, the same convention the body-to-body case uses, so the
        // solver can treat a wall as the second body it does not have.
        if (floor && cy > height) {
          out.push(this.boundary(a, 0, 1, cx, cy, cy - height, `f${i}:${k}`));
        }
        if (cx < 0) out.push(this.boundary(a, -1, 0, cx, cy, -cx, `l${i}:${k}`));
        if (cx > width) out.push(this.boundary(a, 1, 0, cx, cy, cx - width, `r${i}:${k}`));
      }

      for (let j = i + 1; j < this.bodies.length; j++) {
        const b = this.bodies[j];
        if (a.sleeping && b.sleeping) continue;
        // Cheap reject before the axis test.
        const ra = Math.hypot(a.hw, a.hh);
        const rb = Math.hypot(b.hw, b.hh);
        if ((a.x - b.x) ** 2 + (a.y - b.y) ** 2 > (ra + rb) ** 2) continue;
        const hit = sat(a, b);
        if (!hit) continue;
        if (a.sleeping || b.sleeping) {
          a.sleeping = false;
          b.sleeping = false;
          a.still = 0;
          b.still = 0;
        }
        out.push(...manifold(a, b, hit.nx, hit.ny, hit.depth, `${i}-${j}`));
      }
    }
    return out;
  }

  private boundary(
    a: Body, nx: number, ny: number, px: number, py: number, depth: number, key: string,
  ): Contact {
    if (a.sleeping) {
      a.sleeping = false;
      a.still = 0;
    }
    return { a, b: null, nx, ny, px, py, separation: -depth, key, pn: 0, pt: 0 };
  }

  private applyImpulse(c: Contact, ix: number, iy: number) {
    const { a, b } = c;
    const rax = c.px - a.x;
    const ray = c.py - a.y;
    a.vx -= ix * a.invMass;
    a.vy -= iy * a.invMass;
    a.av -= (rax * iy - ray * ix) * a.invI;
    if (!b) return;
    const rbx = c.px - b.x;
    const rby = c.py - b.y;
    b.vx += ix * b.invMass;
    b.vy += iy * b.invMass;
    b.av += (rbx * iy - rby * ix) * b.invI;
  }

  private solve(c: Contact, dt: number) {
    const { a, b } = c;
    const rax = c.px - a.x;
    const ray = c.py - a.y;
    const rbx = b ? c.px - b.x : 0;
    const rby = b ? c.py - b.y : 0;

    const relVel = (nx: number, ny: number) => {
      let vx = -(a.vx - a.av * ray);
      let vy = -(a.vy + a.av * rax);
      if (b) {
        vx += b.vx - b.av * rby;
        vy += b.vy + b.av * rbx;
      }
      return vx * nx + vy * ny;
    };

    const effMass = (nx: number, ny: number) => {
      const ra = rax * ny - ray * nx;
      let m = a.invMass + a.invI * ra * ra;
      if (b) {
        const rb = rbx * ny - rby * nx;
        m += b.invMass + b.invI * rb * rb;
      }
      return m > 0 ? 1 / m : 0;
    };

    // Normal: push apart, with a bias that removes penetration over time.
    const vn = relVel(c.nx, c.ny);
    const bias = (BIAS / dt) * Math.max(0, -c.separation - SLOP);
    let dPn = effMass(c.nx, c.ny) * -(vn + bias + RESTITUTION * Math.min(0, vn));
    const oldPn = c.pn;
    c.pn = Math.max(0, oldPn + dPn);
    dPn = c.pn - oldPn;
    this.applyImpulse(c, dPn * c.nx, dPn * c.ny);

    // Friction along the tangent, clamped to the Coulomb cone.
    const tx = -c.ny;
    const ty = c.nx;
    let dPt = effMass(tx, ty) * -relVel(tx, ty);
    const max = FRICTION * c.pn;
    const oldPt = c.pt;
    c.pt = Math.max(-max, Math.min(max, oldPt + dPt));
    dPt = c.pt - oldPt;
    this.applyImpulse(c, dPt * tx, dPt * ty);
  }
}

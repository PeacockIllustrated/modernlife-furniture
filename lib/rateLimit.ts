/**
 * A small sliding-window rate limiter, keyed by client. It is per-instance and
 * in-memory, which is enough to blunt casual abuse of the enquiry form on a
 * modest site. ARCHITECTURE.md notes the production path is a Supabase edge
 * function backed by a shared store; this keeps the same interface so that swap
 * is a one-line change in the route handler.
 */

const hits = new Map<string, number[]>();

export interface RateResult {
  ok: boolean;
  retryAfterSeconds: number;
}

// Above this many tracked keys, drop any whose newest hit has aged out, so a
// churn of one-off clients cannot grow the map without bound.
const MAX_KEYS = 10000;

function evictStale(since: number) {
  for (const [key, times] of hits) {
    if (times.length === 0 || times[times.length - 1] <= since) {
      hits.delete(key);
    }
  }
}

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  now = Date.now(),
): RateResult {
  const since = now - windowMs;
  if (hits.size > MAX_KEYS) evictStale(since);
  const recent = (hits.get(key) ?? []).filter((t) => t > since);
  if (recent.length >= limit) {
    const retryAfter = Math.ceil((recent[0] + windowMs - now) / 1000);
    hits.set(key, recent);
    return { ok: false, retryAfterSeconds: Math.max(1, retryAfter) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfterSeconds: 0 };
}

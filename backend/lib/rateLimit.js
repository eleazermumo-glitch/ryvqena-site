/** Sliding-window limiter kept in memory. Good for one server process; use a shared store if you scale out. */
export function createRateLimiter({ max, windowMs }) {
  const hits = new Map();
  const sweep = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [k, v] of hits) {
      const fresh = v.filter((t) => t > cutoff);
      if (fresh.length) hits.set(k, fresh);
      else hits.delete(k);
    }
  }, Math.max(1000, windowMs / 2));
  sweep.unref();

  return {
    /** true if allowed (and records the hit), false if over the limit */
    take(key) {
      const now = Date.now();
      const arr = (hits.get(key) || []).filter((t) => t > now - windowMs);
      if (arr.length >= max) {
        hits.set(key, arr);
        return false;
      }
      arr.push(now);
      hits.set(key, arr);
      return true;
    },
    close() {
      clearInterval(sweep);
    },
  };
}

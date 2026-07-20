import 'server-only'

// In-memory, per-warm-instance rate limiting. Good enough to stop a single
// bot hammering one endpoint — it resets on cold start and isn't shared
// across concurrent instances, so it's not a hard guarantee under real
// distributed load. If abuse gets past this, the next step up is a shared
// store (e.g. Upstash Redis) keyed the same way.
const buckets = new Map()
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(now) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > bucket.windowMs) buckets.delete(key)
  }
}

// Fixed-window counter: `limit` requests allowed per `windowMs`, keyed by
// whatever string the caller passes in (usually "routeName:ip").
export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now()
  cleanup(now)

  let bucket = buckets.get(key)
  if (!bucket || now - bucket.windowStart >= windowMs) {
    bucket = { count: 0, windowStart: now, windowMs }
    buckets.set(key, bucket)
  }

  bucket.count += 1

  if (bucket.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.windowMs - (now - bucket.windowStart)) / 1000) }
  }

  return { allowed: true }
}

// Vercel's edge always sets x-forwarded-for; there's no portable built-in
// `.ip` in Route Handlers or Server Actions, so this is the standard way to
// read it. Accepts anything with a `.get()` method — a Route Handler's
// `request.headers`, or the `headers()` object from next/headers in a
// Server Action.
export function getClientIp(headers) {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return headers.get('x-real-ip') || 'unknown'
}

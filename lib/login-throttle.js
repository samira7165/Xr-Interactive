import 'server-only'

// In-memory, per-warm-instance progressive delay for admin login. Keyed by
// the attempted email so a run of wrong passwords against one account gets
// progressively slower, independent of which IP they come from. Same
// limitations as lib/rate-limit.js: resets on cold start, not shared across
// concurrent instances — a real brute-force deterrent needs a shared store,
// this just raises the cost of casual guessing.
const attempts = new Map()
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000
let lastCleanup = Date.now()

const WINDOW_MS = 15 * 60 * 1000
const FREE_ATTEMPTS = 2
const BASE_DELAY_MS = 1000
const MAX_DELAY_MS = 8000

function cleanup(now) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, entry] of attempts) {
    if (now - entry.lastAttempt > WINDOW_MS) attempts.delete(key)
  }
}

// Delay to apply before even checking this attempt's password. Doubles per
// failure past the first couple of free tries (typo tolerance), capped so a
// single request never ties up the function for too long.
export function getLoginDelayMs(key) {
  const now = Date.now()
  cleanup(now)

  const entry = attempts.get(key)
  if (!entry || now - entry.lastAttempt > WINDOW_MS) return 0

  const over = entry.count - FREE_ATTEMPTS
  if (over <= 0) return 0
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (over - 1))
}

export function recordFailedLogin(key) {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now - entry.lastAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, lastAttempt: now })
  } else {
    entry.count += 1
    entry.lastAttempt = now
  }
}

export function clearLoginAttempts(key) {
  attempts.delete(key)
}

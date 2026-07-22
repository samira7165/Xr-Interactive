import 'server-only'
import { prisma } from '@/lib/prisma'

// DB-backed lockout for admin login, keyed by the attempted email. An
// in-memory counter doesn't work here: Vercel can route consecutive requests
// to different serverless instances, so two failed attempts in a row can
// each land on a process with no memory of the other. The database is the
// one thing every instance actually shares.
const ATTEMPT_LIMIT = 5
const FIRST_LOCKOUT_MINUTES = 15
const LOCKOUT_STEP_MINUTES = 10

function lockoutMinutesForStage(stage) {
  return FIRST_LOCKOUT_MINUTES + (stage - 1) * LOCKOUT_STEP_MINUTES
}

function minutesRemaining(lockedUntil) {
  return Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000))
}

// Call before attempting the password check. Returns { locked: true,
// minutesRemaining } if this email is currently locked out.
export async function checkLoginLock(key) {
  const entry = await prisma.loginAttempt.findUnique({ where: { email: key } })
  if (!entry?.lockedUntil || entry.lockedUntil.getTime() <= Date.now()) return { locked: false }
  return { locked: true, minutesRemaining: minutesRemaining(entry.lockedUntil) }
}

// Call after a failed password check. Returns { locked: true,
// minutesRemaining } if this failure just crossed the attempt limit and
// triggered a new (longer) lockout.
export async function recordFailedLogin(key) {
  const now = new Date()
  const entry = await prisma.loginAttempt.findUnique({ where: { email: key } })
  const count = (entry?.count ?? 0) + 1

  if (count >= ATTEMPT_LIMIT) {
    const stage = (entry?.lockoutStage ?? 0) + 1
    const lockedUntil = new Date(now.getTime() + lockoutMinutesForStage(stage) * 60000)
    await prisma.loginAttempt.upsert({
      where: { email: key },
      create: { email: key, count: 0, lastAttempt: now, lockedUntil, lockoutStage: stage },
      update: { count: 0, lastAttempt: now, lockedUntil, lockoutStage: stage },
    })
    return { locked: true, minutesRemaining: minutesRemaining(lockedUntil) }
  }

  await prisma.loginAttempt.upsert({
    where: { email: key },
    create: { email: key, count, lastAttempt: now },
    update: { count, lastAttempt: now },
  })
  return { locked: false }
}

// Call after a successful login — clears the count and resets the lockout
// escalation back to zero.
export async function clearLoginAttempts(key) {
  await prisma.loginAttempt.deleteMany({ where: { email: key } })
}

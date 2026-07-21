import 'server-only'
import { prisma } from '@/lib/prisma'

// DB-backed progressive delay for admin login, keyed by the attempted email.
// An in-memory counter doesn't work here: Vercel can route consecutive
// requests to different serverless instances, so two failed attempts in a
// row can each land on a process with no memory of the other, and the
// throttle never accumulates. The database is the one thing every instance
// actually shares.
const WINDOW_MS = 15 * 60 * 1000
const FREE_ATTEMPTS = 2
const BASE_DELAY_MS = 1000
const MAX_DELAY_MS = 8000

export async function getLoginDelayMs(key) {
  const entry = await prisma.loginAttempt.findUnique({ where: { email: key } })
  if (!entry || Date.now() - entry.lastAttempt.getTime() > WINDOW_MS) return 0

  const over = entry.count - FREE_ATTEMPTS
  if (over <= 0) return 0
  return Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (over - 1))
}

export async function recordFailedLogin(key) {
  const now = new Date()
  const entry = await prisma.loginAttempt.findUnique({ where: { email: key } })

  if (!entry || now.getTime() - entry.lastAttempt.getTime() > WINDOW_MS) {
    await prisma.loginAttempt.upsert({
      where: { email: key },
      create: { email: key, count: 1, lastAttempt: now },
      update: { count: 1, lastAttempt: now },
    })
  } else {
    await prisma.loginAttempt.update({
      where: { email: key },
      data: { count: { increment: 1 }, lastAttempt: now },
    })
  }
}

export async function clearLoginAttempts(key) {
  await prisma.loginAttempt.deleteMany({ where: { email: key } })
}

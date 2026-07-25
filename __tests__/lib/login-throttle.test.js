import { checkLoginLock, recordFailedLogin, clearLoginAttempts } from '@/lib/login-throttle'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: { loginAttempt: { findUnique: jest.fn(), upsert: jest.fn(), deleteMany: jest.fn() } },
}))

const NOW = 1_800_000_000_000 // fixed instant so lockout math is deterministic

describe('checkLoginLock', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // login-throttle.js builds timestamps with `new Date()`, not
    // `Date.now()` — spying on Date.now alone doesn't affect `new Date()`,
    // so fake timers (which override both) are needed here.
    jest.useFakeTimers({ now: NOW })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('is not locked when no attempt record exists', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue(null)

    await expect(checkLoginLock('a@b.com')).resolves.toEqual({ locked: false })
  })

  it('is not locked when the record has no lockedUntil', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue({ count: 2, lockedUntil: null })

    await expect(checkLoginLock('a@b.com')).resolves.toEqual({ locked: false })
  })

  it('is not locked once lockedUntil is in the past', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue({ lockedUntil: new Date(NOW - 1000) })

    await expect(checkLoginLock('a@b.com')).resolves.toEqual({ locked: false })
  })

  it('is locked with minutes-remaining rounded up while lockedUntil is in the future', async () => {
    // 12.5 minutes out — rounds up to 13, matching a user-facing "at least
    // this long" estimate rather than an optimistic truncation.
    prisma.loginAttempt.findUnique.mockResolvedValue({ lockedUntil: new Date(NOW + 12.5 * 60_000) })

    await expect(checkLoginLock('a@b.com')).resolves.toEqual({ locked: true, minutesRemaining: 13 })
  })

  it('reads the record keyed by the exact email passed in', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue(null)

    await checkLoginLock('someone@example.com')

    expect(prisma.loginAttempt.findUnique).toHaveBeenCalledWith({ where: { email: 'someone@example.com' } })
  })
})

describe('recordFailedLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // login-throttle.js builds timestamps with `new Date()`, not
    // `Date.now()` — spying on Date.now alone doesn't affect `new Date()`,
    // so fake timers (which override both) are needed here.
    jest.useFakeTimers({ now: NOW })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('starts a new record at count 1 on the first failure', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue(null)

    const result = await recordFailedLogin('a@b.com')

    expect(result).toEqual({ locked: false })
    expect(prisma.loginAttempt.upsert).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
      create: { email: 'a@b.com', count: 1, lastAttempt: new Date(NOW) },
      update: { count: 1, lastAttempt: new Date(NOW) },
    })
  })

  it('increments an existing count that is still under the limit', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue({ count: 3 })

    const result = await recordFailedLogin('a@b.com')

    expect(result).toEqual({ locked: false })
    expect(prisma.loginAttempt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ count: 4 }) })
    )
  })

  it('locks out for 15 minutes and resets the counter on the 5th failure (first lockout stage)', async () => {
    prisma.loginAttempt.findUnique.mockResolvedValue({ count: 4, lockoutStage: 0 })

    const result = await recordFailedLogin('a@b.com')

    expect(result).toEqual({ locked: true, minutesRemaining: 15 })
    expect(prisma.loginAttempt.upsert).toHaveBeenCalledWith({
      where: { email: 'a@b.com' },
      create: { email: 'a@b.com', count: 0, lastAttempt: new Date(NOW), lockedUntil: new Date(NOW + 15 * 60_000), lockoutStage: 1 },
      update: { count: 0, lastAttempt: new Date(NOW), lockedUntil: new Date(NOW + 15 * 60_000), lockoutStage: 1 },
    })
  })

  it('escalates the lockout by 10 minutes on each subsequent lockout stage', async () => {
    // Already been locked out once before (lockoutStage: 1) and now hits the
    // limit a second time — the whole point of escalation is that repeat
    // offenders get a longer wait each time, not the same 15 minutes forever.
    prisma.loginAttempt.findUnique.mockResolvedValue({ count: 4, lockoutStage: 1 })

    const result = await recordFailedLogin('a@b.com')

    expect(result).toEqual({ locked: true, minutesRemaining: 25 })
    expect(prisma.loginAttempt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ lockoutStage: 2, lockedUntil: new Date(NOW + 25 * 60_000) }),
      })
    )
  })
})

describe('clearLoginAttempts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deletes the attempt record for the given email', async () => {
    await clearLoginAttempts('a@b.com')

    expect(prisma.loginAttempt.deleteMany).toHaveBeenCalledWith({ where: { email: 'a@b.com' } })
  })
})

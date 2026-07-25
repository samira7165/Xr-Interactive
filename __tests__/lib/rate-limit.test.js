import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Each test uses a random key so the module-level bucket Map (shared across
// tests in this file) never lets one test's counter bleed into another's.
function uniqueKey() {
  return `test-${Math.random()}`
}

describe('rateLimit', () => {
  it('allows requests up to the limit', () => {
    const key = uniqueKey()
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, { limit: 3, windowMs: 60_000 }).allowed).toBe(true)
    }
  })

  it('blocks requests once the limit is exceeded', () => {
    const key = uniqueKey()
    for (let i = 0; i < 3; i++) rateLimit(key, { limit: 3, windowMs: 60_000 })
    const result = rateLimit(key, { limit: 3, windowMs: 60_000 })
    expect(result.allowed).toBe(false)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('resets the count once the window elapses', () => {
    const key = uniqueKey()
    const nowSpy = jest.spyOn(Date, 'now')

    nowSpy.mockReturnValue(1_000_000)
    expect(rateLimit(key, { limit: 1, windowMs: 1000 }).allowed).toBe(true)
    expect(rateLimit(key, { limit: 1, windowMs: 1000 }).allowed).toBe(false)

    nowSpy.mockReturnValue(1_000_000 + 1001)
    expect(rateLimit(key, { limit: 1, windowMs: 1000 }).allowed).toBe(true)

    nowSpy.mockRestore()
  })
})

describe('getClientIp', () => {
  function headersFrom(map) {
    return { get: (name) => map[name.toLowerCase()] ?? null }
  }

  it('uses the last entry in x-forwarded-for (the hop Vercel itself appended)', () => {
    const headers = headersFrom({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp(headers)).toBe('5.6.7.8')
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const headers = headersFrom({ 'x-real-ip': '9.9.9.9' })
    expect(getClientIp(headers)).toBe('9.9.9.9')
  })

  it('falls back to "unknown" when no IP headers are present', () => {
    expect(getClientIp(headersFrom({}))).toBe('unknown')
  })
})

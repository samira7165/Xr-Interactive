/**
 * @jest-environment node
 */
// proxy.js's default export is `auth(callback)` — NextAuth's `auth` HOC
// wraps `callback` with real session/JWT verification. Mocking `auth` as an
// identity function unwraps that, so the default export becomes the raw
// callback itself, letting it be called directly with a hand-built `req`
// (including `req.auth`, which the real HOC would normally attach).
jest.mock('@/auth', () => ({ auth: (middleware) => middleware }))

import middleware from '@/proxy'

function makeReq(pathname, { session = null, isServerAction = false } = {}) {
  return {
    nextUrl: new URL(`http://localhost:3000${pathname}`),
    headers: new Headers(isServerAction ? { 'next-action': 'abc123' } : {}),
    auth: session,
  }
}

const adminSession = (role = 'ADMIN') => ({ user: { role } })

describe('proxy middleware', () => {
  it('redirects an unauthenticated request to /admin/login', () => {
    const response = middleware(makeReq('/admin'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login')
  })

  it('lets an unauthenticated request through to the login page itself (no redirect loop)', () => {
    const response = middleware(makeReq('/admin/login'))

    expect(response).toBeUndefined()
  })

  it('lets an unauthenticated Server Action request through, deferring to the action\'s own auth() check', () => {
    const response = middleware(makeReq('/admin/blog', { isServerAction: true }))

    expect(response).toBeUndefined()
  })

  it('lets an authenticated plain ADMIN through to an ordinary admin page', () => {
    const response = middleware(makeReq('/admin', { session: adminSession('ADMIN') }))

    expect(response).toBeUndefined()
  })

  it('redirects a plain ADMIN away from /admin/signup', () => {
    const response = middleware(makeReq('/admin/signup', { session: adminSession('ADMIN') }))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/admin')
  })

  it('redirects a plain ADMIN away from /admin/team and its subpaths', () => {
    const list = middleware(makeReq('/admin/team', { session: adminSession('ADMIN') }))
    const edit = middleware(makeReq('/admin/team/5/edit', { session: adminSession('ADMIN') }))

    expect(list.headers.get('location')).toBe('http://localhost:3000/admin')
    expect(edit.headers.get('location')).toBe('http://localhost:3000/admin')
  })

  it('lets a SUPER_ADMIN through to /admin/signup and /admin/team', () => {
    const signup = middleware(makeReq('/admin/signup', { session: adminSession('SUPER_ADMIN') }))
    const team = middleware(makeReq('/admin/team', { session: adminSession('SUPER_ADMIN') }))

    expect(signup).toBeUndefined()
    expect(team).toBeUndefined()
  })

  it('exempts Server Action requests from the SUPER_ADMIN-only gate too', () => {
    // The signup/team Server Actions re-check the role themselves — this
    // route-level gate would otherwise redirect a legitimate in-flight
    // submission from a real SUPER_ADMIN's browser (see proxy.js comment).
    const response = middleware(
      makeReq('/admin/team', { session: adminSession('ADMIN'), isServerAction: true })
    )

    expect(response).toBeUndefined()
  })
})

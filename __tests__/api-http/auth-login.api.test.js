// Real end-to-end HTTP test of the actual Auth.js sign-in wire protocol
// (GET csrf -> POST credentials callback -> session cookie), then reusing
// that cookie against a real protected route. Nothing here is mocked: this
// is the exact request sequence a browser's signIn() call makes.
import { apiFetch, loginAsAdmin, withCookie } from './helpers/client'

const TEST_ADMIN = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }

describe('Admin login (real HTTP against Auth.js)', () => {
  it('rejects an unauthenticated request to a protected admin route', async () => {
    const response = await apiFetch('/api/admin/search?q=ab')

    expect(response.status).toBe(401)
  })

  it('rejects sign-in with a wrong password', async () => {
    await expect(loginAsAdmin({ email: TEST_ADMIN.email, password: 'definitely-wrong' })).rejects.toThrow(
      /CredentialsSignin/
    )
  })

  it('rejects sign-in for an email that has no account', async () => {
    await expect(loginAsAdmin({ email: 'nobody@xri.test', password: 'whatever' })).rejects.toThrow(
      /CredentialsSignin/
    )
  })

  it('logs in with valid credentials and the resulting session cookie authenticates later requests', async () => {
    const cookie = await loginAsAdmin(TEST_ADMIN)
    expect(cookie).toMatch(/authjs\.session-token=/)

    const response = await apiFetch('/api/admin/search?q=ab', { headers: withCookie(cookie) })
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ results: [] }) // "ab" matches nothing seeded, but the request itself is authorized
  })

  it('reuses one session across multiple different admin endpoints', async () => {
    // Confirms this is a real, reusable session — not a one-shot token tied
    // to a single route — the way an admin's browser session behaves across
    // page navigations.
    const cookie = await loginAsAdmin(TEST_ADMIN)

    const search = await apiFetch('/api/admin/search?q=vr', { headers: withCookie(cookie) })
    // Deliberately invalid payload — this call only exists to prove the
    // session authenticates a *second*, different admin route (we get past
    // the 401 check straight to 400 validation), not to create a post.
    const create = await apiFetch('/api/admin/blog', {
      method: 'POST',
      headers: withCookie(cookie),
      body: new FormData(),
    })

    expect(search.status).toBe(200)
    expect(create.status).toBe(400)
  })
})

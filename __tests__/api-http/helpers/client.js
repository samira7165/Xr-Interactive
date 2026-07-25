// Thin wrapper around plain fetch aimed at the real Next.js server spawned
// in globalSetup — no route handlers are imported, no Prisma/auth/blob is
// mocked here. Test files should treat this the way an external HTTP client
// (browser, curl, another service) would.
import fs from 'node:fs'
import { SERVER_INFO_PATH } from '../setup/globalSetup.js'

let cachedBaseUrl

export function getBaseUrl() {
  if (cachedBaseUrl) return cachedBaseUrl
  if (process.env.API_TEST_BASE_URL) return (cachedBaseUrl = process.env.API_TEST_BASE_URL)
  const { baseUrl } = JSON.parse(fs.readFileSync(SERVER_INFO_PATH, 'utf8'))
  return (cachedBaseUrl = baseUrl)
}

export function apiFetch(path, options = {}) {
  return fetch(`${getBaseUrl()}${path}`, options)
}

function cookieHeaderFrom(response) {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ')
}

function mergeCookies(...headers) {
  const jar = new Map()
  for (const header of headers) {
    if (!header) continue
    for (const pair of header.split('; ')) {
      const [name, ...rest] = pair.split('=')
      if (name) jar.set(name, rest.join('='))
    }
  }
  return [...jar.entries()].map(([name, value]) => `${name}=${value}`).join('; ')
}

// Drives Auth.js's own HTTP wire protocol the same way the browser's
// `signIn()` call does under the hood: fetch a CSRF token/cookie, then POST
// credentials to the callback route, then collect the session cookie it
// sets. Returns a `Cookie` header string ready to attach to later requests.
export async function loginAsAdmin({ email, password }) {
  const csrfRes = await apiFetch('/api/auth/csrf')
  const csrfCookies = cookieHeaderFrom(csrfRes)
  const { csrfToken } = await csrfRes.json()

  const loginRes = await apiFetch('/api/auth/callback/credentials', {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: csrfCookies,
    },
    body: new URLSearchParams({ email, password, csrfToken, json: 'true' }),
  })

  const location = loginRes.headers.get('location') || ''
  if (location.includes('error=')) {
    throw new Error(`Login failed for ${email}: redirected to ${location}`)
  }

  const sessionCookies = cookieHeaderFrom(loginRes)
  return mergeCookies(csrfCookies, sessionCookies)
}

export function withCookie(cookie, headers = {}) {
  return { ...headers, Cookie: cookie }
}

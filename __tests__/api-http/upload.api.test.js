// Real end-to-end HTTP test: a real multipart POST to the real running
// server, which uploads to the real Vercel Blob store (there is no separate
// "test" blob store, so this hits the same public store production uses —
// every blob this suite creates is deleted again in afterEach via the Blob
// SDK's `del`, so nothing is left behind).
import { del } from '@vercel/blob'
import { apiFetch, loginAsAdmin, withCookie } from './helpers/client'

const uploadedUrls = []

function pngFile(sizeBytes = 1024, name = 'photo.png') {
  return new File([new Uint8Array(sizeBytes)], name, { type: 'image/png' })
}

function uploadForm(file) {
  const formData = new FormData()
  if (file) formData.append('file', file)
  return formData
}

describe('POST /api/upload (real HTTP + real Vercel Blob)', () => {
  let cookie

  beforeAll(async () => {
    cookie = await loginAsAdmin({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
  })

  afterEach(async () => {
    while (uploadedUrls.length) {
      const url = uploadedUrls.pop()
      await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN_PUBLIC })
    }
  })

  it('rejects an unauthenticated upload', async () => {
    const response = await apiFetch('/api/upload', { method: 'POST', body: uploadForm(pngFile()) })
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
  })

  it('rejects a request with no file', async () => {
    const response = await apiFetch('/api/upload', {
      method: 'POST',
      headers: withCookie(cookie),
      body: uploadForm(null),
    })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No file provided')
  })

  it('rejects an unsupported file type', async () => {
    const svg = new File(['<svg/>'], 'evil.svg', { type: 'image/svg+xml' })
    const response = await apiFetch('/api/upload', { method: 'POST', headers: withCookie(cookie), body: uploadForm(svg) })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/unsupported file type/i)
  })

  it('rejects a file over 5MB', async () => {
    const bigFile = pngFile(5 * 1024 * 1024 + 1)
    const response = await apiFetch('/api/upload', {
      method: 'POST',
      headers: withCookie(cookie),
      body: uploadForm(bigFile),
    })
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/too large/i)
  })

  it('uploads a valid PNG and the returned url is a real, publicly fetchable blob', async () => {
    const response = await apiFetch('/api/upload', {
      method: 'POST',
      headers: withCookie(cookie),
      body: uploadForm(pngFile(2048)),
    })
    const json = await response.json()
    expect(response.status).toBe(200)
    expect(json.url).toMatch(/^https:\/\//)
    uploadedUrls.push(json.url)

    // Confirms the file genuinely landed in Vercel Blob storage, not just
    // that the route claimed success.
    const blobResponse = await fetch(json.url)
    expect(blobResponse.status).toBe(200)
    expect(blobResponse.headers.get('content-type')).toBe('image/png')
  })
})

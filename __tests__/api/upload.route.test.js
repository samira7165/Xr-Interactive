/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST } from '@/app/api/upload/route'
import { auth } from '@/auth'
import { put } from '@vercel/blob'
import { adminSession, formDataRequest } from '../helpers/api'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@vercel/blob', () => ({ put: jest.fn() }))

function requestWithFile(file) {
  return formDataRequest('http://localhost/api/upload', file ? { file } : {})
}

function pngFile(sizeBytes = 1024, name = 'photo.png') {
  return new File([new Uint8Array(sizeBytes)], name, { type: 'image/png' })
}

describe('POST /api/upload (admin image upload)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await POST(requestWithFile(pngFile()))
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.error).toBe('Unauthorized')
    expect(put).not.toHaveBeenCalled()
  })

  it('rejects a request with no file', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await POST(requestWithFile(null))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No file provided')
    expect(put).not.toHaveBeenCalled()
  })

  it('rejects an unsupported file type (e.g. SVG, to block stored XSS)', async () => {
    auth.mockResolvedValue(adminSession())
    const svgFile = new File(['<svg onload="alert(1)"/>'], 'evil.svg', { type: 'image/svg+xml' })

    const response = await POST(requestWithFile(svgFile))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/unsupported file type/i)
    expect(put).not.toHaveBeenCalled()
  })

  it('rejects a file over 5MB', async () => {
    auth.mockResolvedValue(adminSession())
    const bigFile = pngFile(5 * 1024 * 1024 + 1)

    const response = await POST(requestWithFile(bigFile))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/too large/i)
    expect(put).not.toHaveBeenCalled()
  })

  it('uploads a valid PNG and returns its blob url', async () => {
    auth.mockResolvedValue(adminSession())
    put.mockResolvedValue({ url: 'https://blob.example.com/uploads/photo.png' })

    const response = await POST(requestWithFile(pngFile()))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ url: 'https://blob.example.com/uploads/photo.png' })
    expect(put).toHaveBeenCalledWith(
      expect.stringMatching(/^uploads\/.+\.png$/),
      expect.anything(),
      expect.objectContaining({ access: 'public', contentType: 'image/png' })
    )
  })

  it('never derives the stored filename from the original name (path/extension smuggling)', async () => {
    auth.mockResolvedValue(adminSession())
    put.mockResolvedValue({ url: 'https://blob.example.com/uploads/x.png' })

    await POST(requestWithFile(pngFile(1024, '../../evil.php.png')))

    expect(put).toHaveBeenCalledWith(expect.not.stringContaining('evil'), expect.anything(), expect.anything())
  })

  it('returns 500 when the blob upload fails', async () => {
    auth.mockResolvedValue(adminSession())
    put.mockRejectedValue(new Error('Blob store unavailable'))

    const response = await POST(requestWithFile(pngFile()))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Blob store unavailable')
  })
})

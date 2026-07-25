/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { POST } from '@/app/api/upload-resume/route'
import { put } from '@vercel/blob'
import { formDataRequest } from '../helpers/api'

jest.mock('@vercel/blob', () => ({ put: jest.fn() }))

// Each test uses its own IP so the rate-limit module's shared bucket Map
// never lets one test's request count bleed into another's.
let ipCounter = 0
function requestWithFile(file, { ip = `10.0.3.${++ipCounter}` } = {}) {
  return formDataRequest(
    'http://localhost/api/upload-resume',
    file ? { file } : {},
    { headers: { 'x-forwarded-for': ip } }
  )
}

function pdfFile(sizeBytes = 1024, name = 'resume.pdf') {
  return new File([new Uint8Array(sizeBytes)], name, { type: 'application/pdf' })
}

describe('POST /api/upload-resume (public applicant upload)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects a request with no file', async () => {
    const response = await POST(requestWithFile(null))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toBe('No file provided')
    expect(put).not.toHaveBeenCalled()
  })

  it('rejects an unsupported file type', async () => {
    const imageFile = new File([new Uint8Array(10)], 'photo.png', { type: 'image/png' })

    const response = await POST(requestWithFile(imageFile))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/unsupported file type/i)
    expect(put).not.toHaveBeenCalled()
  })

  it('rejects a file over 5MB', async () => {
    const response = await POST(requestWithFile(pdfFile(5 * 1024 * 1024 + 1)))
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.error).toMatch(/too large/i)
    expect(put).not.toHaveBeenCalled()
  })

  it('uploads a valid PDF privately and returns the blob url plus original filename', async () => {
    put.mockResolvedValue({ url: 'https://blob.example.com/uploads/resumes/x.pdf' })

    const response = await POST(requestWithFile(pdfFile(1024, 'ada-resume.pdf')))
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ url: 'https://blob.example.com/uploads/resumes/x.pdf', name: 'ada-resume.pdf' })
    expect(put).toHaveBeenCalledWith(
      expect.stringMatching(/^uploads\/resumes\/.+\.pdf$/),
      expect.anything(),
      expect.objectContaining({ access: 'private', contentType: 'application/pdf' })
    )
  })

  it('accepts DOC and DOCX in addition to PDF', async () => {
    put.mockResolvedValue({ url: 'https://blob.example.com/uploads/resumes/x.docx' })
    const docxFile = new File([new Uint8Array(10)], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })

    const response = await POST(requestWithFile(docxFile))

    expect(response.status).toBe(200)
  })

  it('returns 500 when the blob upload fails', async () => {
    put.mockRejectedValue(new Error('Blob store unavailable'))

    const response = await POST(requestWithFile(pdfFile()))
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json.error).toBe('Blob store unavailable')
  })

  it('rate-limits repeated uploads from the same IP after 10 requests', async () => {
    const ip = '10.0.3.99'
    put.mockResolvedValue({ url: 'https://blob.example.com/uploads/resumes/x.pdf' })

    for (let i = 0; i < 10; i++) {
      const response = await POST(requestWithFile(pdfFile(), { ip }))
      expect(response.status).toBe(200)
    }

    const blocked = await POST(requestWithFile(pdfFile(), { ip }))
    const json = await blocked.json()

    expect(blocked.status).toBe(429)
    expect(json.error).toMatch(/too many requests/i)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
    expect(put).toHaveBeenCalledTimes(10)
  })
})

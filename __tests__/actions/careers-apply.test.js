/**
 * @jest-environment node
 */
// Server Actions are plain async functions once 'use server' is stripped —
// calling them directly exercises the real validation/rate-limit/business
// logic, same boundary-mocking approach as the route handler tests.
import { submitApplication } from '@/app/careers/[slug]/apply/actions'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { sendApplicationNotification } from '@/lib/email'
import { buildFormData } from '../helpers/actions'

jest.mock('next/headers', () => ({ headers: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: { jobApplication: { create: jest.fn() } },
}))
jest.mock('@/lib/email', () => ({ sendApplicationNotification: jest.fn() }))

let ipCounter = 0
function headersFor(ip = `10.1.0.${++ipCounter}`) {
  const map = { 'x-forwarded-for': ip }
  return { get: (name) => map[name.toLowerCase()] ?? null }
}

const validFields = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  country: 'Bangladesh',
  linkedin: '',
  resumeUrl: 'https://blob.example.com/resumes/ada.pdf',
}

describe('submitApplication', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    headers.mockResolvedValue(headersFor())
  })

  it('creates a job application and notifies the team for a valid submission', async () => {
    prisma.jobApplication.create.mockResolvedValue({
      id: 1,
      ...validFields,
      job: { title: 'XR Engineer' },
    })

    const result = await submitApplication(42, undefined, buildFormData(validFields))

    expect(result).toEqual({ errors: {}, success: true })
    expect(prisma.jobApplication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: validFields.name, email: validFields.email, jobId: 42, linkedin: null }),
      include: { job: { select: { title: true } } },
    })
    expect(sendApplicationNotification).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 'XR Engineer')
  })

  it('falls back to a generic job title when the job relation is missing', async () => {
    prisma.jobApplication.create.mockResolvedValue({ id: 1, ...validFields, job: null })

    await submitApplication(42, undefined, buildFormData(validFields))

    expect(sendApplicationNotification).toHaveBeenCalledWith(expect.anything(), 'a job')
  })

  it('rejects an invalid submission without touching the database', async () => {
    const result = await submitApplication(
      42,
      undefined,
      buildFormData({ ...validFields, email: 'not-an-email', resumeUrl: 'not-a-url' })
    )

    expect(result.success).toBe(false)
    expect(result.errors).toHaveProperty('email')
    expect(result.errors).toHaveProperty('resumeUrl')
    expect(prisma.jobApplication.create).not.toHaveBeenCalled()
    expect(sendApplicationNotification).not.toHaveBeenCalled()
  })

  it('rejects a missing required field', async () => {
    const { country, ...withoutCountry } = validFields

    const result = await submitApplication(42, undefined, buildFormData(withoutCountry))

    expect(result.success).toBe(false)
    expect(result.errors).toHaveProperty('country')
  })

  it('rejects an http(s)-only field given a javascript: url (XSS guard)', async () => {
    const result = await submitApplication(
      42,
      undefined,
      buildFormData({ ...validFields, resumeUrl: 'javascript:alert(1)' })
    )

    expect(result.success).toBe(false)
    expect(result.errors).toHaveProperty('resumeUrl')
  })

  it('returns a generic error message and does not throw when the database write fails', async () => {
    prisma.jobApplication.create.mockRejectedValue(new Error('Connection lost'))

    const result = await submitApplication(42, undefined, buildFormData(validFields))

    expect(result).toEqual({ errors: {}, success: false, message: 'Something went wrong. Please try again.' })
    expect(sendApplicationNotification).not.toHaveBeenCalled()
  })

  it('rate-limits the 6th application from the same IP within a minute', async () => {
    const ip = '10.1.0.99'
    headers.mockResolvedValue(headersFor(ip))
    prisma.jobApplication.create.mockResolvedValue({ id: 1, ...validFields, job: null })

    for (let i = 0; i < 5; i++) {
      const result = await submitApplication(42, undefined, buildFormData(validFields))
      expect(result.success).toBe(true)
    }

    const blocked = await submitApplication(42, undefined, buildFormData(validFields))

    expect(blocked.success).toBe(false)
    expect(blocked.message).toMatch(/too many requests/i)
    expect(prisma.jobApplication.create).toHaveBeenCalledTimes(5)
  })
})

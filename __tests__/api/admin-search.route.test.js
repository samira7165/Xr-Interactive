/**
 * @jest-environment node
 */
// Route handlers run on the Web Request/Response APIs, not the DOM, so this
// file opts out of the project-wide jsdom environment.

import { GET } from '@/app/api/admin/search/route'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { adminSession } from '../helpers/api'

jest.mock('@/auth', () => ({ auth: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: {
    contact: { findMany: jest.fn() },
    post: { findMany: jest.fn() },
    project: { findMany: jest.fn() },
    service: { findMany: jest.fn() },
    job: { findMany: jest.fn() },
    teamMember: { findMany: jest.fn() },
    jobApplication: { findMany: jest.fn() },
  },
}))

function call(query) {
  const url = query === undefined ? 'http://localhost/api/admin/search' : `http://localhost/api/admin/search?q=${encodeURIComponent(query)}`
  return GET(new Request(url))
}

function mockEmptyResults() {
  prisma.contact.findMany.mockResolvedValue([])
  prisma.post.findMany.mockResolvedValue([])
  prisma.project.findMany.mockResolvedValue([])
  prisma.service.findMany.mockResolvedValue([])
  prisma.job.findMany.mockResolvedValue([])
  prisma.teamMember.findMany.mockResolvedValue([])
  prisma.jobApplication.findMany.mockResolvedValue([])
}

describe('GET /api/admin/search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('rejects an unauthenticated request', async () => {
    auth.mockResolvedValue(null)

    const response = await call('ada')

    expect(response.status).toBe(401)
    expect(prisma.contact.findMany).not.toHaveBeenCalled()
  })

  it('returns no results and skips all queries when q is missing', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await call(undefined)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json).toEqual({ results: [] })
    expect(prisma.contact.findMany).not.toHaveBeenCalled()
  })

  it('returns no results and skips all queries when q is shorter than 2 characters', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await call('a')
    const json = await response.json()

    expect(json).toEqual({ results: [] })
    expect(prisma.contact.findMany).not.toHaveBeenCalled()
  })

  it('does not query team members for a plain ADMIN session', async () => {
    auth.mockResolvedValue(adminSession('ADMIN'))
    mockEmptyResults()
    prisma.contact.findMany.mockResolvedValue([{ id: 1, name: 'Ada Contact', email: 'ada@example.com' }])

    const response = await call('ada')
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(prisma.teamMember.findMany).not.toHaveBeenCalled()
    expect(json.results).toEqual([
      { group: 'Contacts', label: 'Ada Contact', sublabel: 'ada@example.com', href: '/admin/contacts' },
    ])
  })

  it('includes team members for a SUPER_ADMIN session and aggregates every group', async () => {
    auth.mockResolvedValue(adminSession('SUPER_ADMIN'))
    prisma.contact.findMany.mockResolvedValue([{ id: 1, name: 'Ada C', email: 'ada@c.com' }])
    prisma.post.findMany.mockResolvedValue([{ id: 2, title: 'Ada Post', category: 'News' }])
    prisma.project.findMany.mockResolvedValue([{ id: 3, title: 'Ada Project', category: 'VR' }])
    prisma.service.findMany.mockResolvedValue([{ id: 4, title: 'Ada Service' }])
    prisma.job.findMany.mockResolvedValue([{ id: 5, title: 'Ada Job', location: 'Remote' }])
    prisma.teamMember.findMany.mockResolvedValue([{ id: 6, name: 'Ada Team', role: 'Engineer' }])
    prisma.jobApplication.findMany.mockResolvedValue([{ id: 7, name: 'Ada App', email: 'ada@app.com' }])

    const response = await call('ada')
    const json = await response.json()

    expect(prisma.teamMember.findMany).toHaveBeenCalled()
    expect(json.results).toEqual([
      { group: 'Contacts', label: 'Ada C', sublabel: 'ada@c.com', href: '/admin/contacts' },
      { group: 'Blog', label: 'Ada Post', sublabel: 'News', href: '/admin/blog/2/edit' },
      { group: 'Portfolio', label: 'Ada Project', sublabel: 'VR', href: '/admin/portfolio/3/edit' },
      { group: 'Services', label: 'Ada Service', sublabel: undefined, href: '/admin/services/4/edit' },
      { group: 'Careers', label: 'Ada Job', sublabel: 'Remote', href: '/admin/careers/5/edit' },
      { group: 'Team', label: 'Ada Team', sublabel: 'Engineer', href: '/admin/team/6/edit' },
      { group: 'Applications', label: 'Ada App', sublabel: 'ada@app.com', href: '/admin/applications' },
    ])
  })

  it('trims the query and requires at least 2 non-whitespace characters', async () => {
    auth.mockResolvedValue(adminSession())

    const response = await call('  a  ')
    const json = await response.json()

    expect(json).toEqual({ results: [] })
    expect(prisma.contact.findMany).not.toHaveBeenCalled()
  })
})

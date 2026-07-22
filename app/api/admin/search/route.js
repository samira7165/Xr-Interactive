import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const q = new URL(request.url).searchParams.get('q')?.trim()
  if (!q || q.length < 2) return NextResponse.json({ results: [] })

  const isSuperAdmin = session.user?.role === 'SUPER_ADMIN'
  const take = 5

  const [contacts, posts, projects, services, jobs, team, applications] = await Promise.all([
    prisma.contact.findMany({
      where: { OR: [{ name: { contains: q } }, { email: { contains: q } }] },
      select: { id: true, name: true, email: true },
      take,
    }),
    prisma.post.findMany({
      where: { title: { contains: q } },
      select: { id: true, title: true, category: true },
      take,
    }),
    prisma.project.findMany({
      where: { title: { contains: q } },
      select: { id: true, title: true, category: true },
      take,
    }),
    prisma.service.findMany({
      where: { title: { contains: q } },
      select: { id: true, title: true },
      take,
    }),
    prisma.job.findMany({
      where: { OR: [{ title: { contains: q } }, { department: { contains: q } }, { location: { contains: q } }] },
      select: { id: true, title: true, location: true },
      take,
    }),
    // Team members are only visible to SUPER_ADMIN (see proxy.js) — keep the
    // search results consistent with what a regular ADMIN can actually open.
    isSuperAdmin
      ? prisma.teamMember.findMany({
          where: { OR: [{ name: { contains: q } }, { role: { contains: q } }] },
          select: { id: true, name: true, role: true },
          take,
        })
      : Promise.resolve([]),
    prisma.jobApplication.findMany({
      where: { OR: [{ name: { contains: q } }, { email: { contains: q } }] },
      select: { id: true, name: true, email: true },
      take,
    }),
  ])

  const results = [
    ...contacts.map(c => ({ group: 'Contacts', label: c.name, sublabel: c.email, href: '/admin/contacts' })),
    ...posts.map(p => ({ group: 'Blog', label: p.title, sublabel: p.category, href: `/admin/blog/${p.id}/edit` })),
    ...projects.map(p => ({ group: 'Portfolio', label: p.title, sublabel: p.category, href: `/admin/portfolio/${p.id}/edit` })),
    ...services.map(s => ({ group: 'Services', label: s.title, href: `/admin/services/${s.id}/edit` })),
    ...jobs.map(j => ({ group: 'Careers', label: j.title, sublabel: j.location, href: `/admin/careers/${j.id}/edit` })),
    ...team.map(t => ({ group: 'Team', label: t.name, sublabel: t.role, href: `/admin/team/${t.id}/edit` })),
    ...applications.map(a => ({ group: 'Applications', label: a.name, sublabel: a.email, href: '/admin/applications' })),
  ]

  return NextResponse.json({ results })
}

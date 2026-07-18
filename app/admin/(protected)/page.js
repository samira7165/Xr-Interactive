import Link from 'next/link'
import { Briefcase, Sparkles, Building2, Mail, FileText, Users, GraduationCap, FileUser } from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function getCounts() {
  const [projects, services, clients, messages, employees, jobs, applications] = await Promise.all([
    prisma.project.count(),
    prisma.service.count(),
    prisma.client.count(),
    prisma.contact.count(),
    prisma.teamMember.count(),
    prisma.job.count({ where: { active: true } }),
    prisma.jobApplication.count(),
  ])
  return { projects, services, clients, messages, employees, jobs, applications }
}

function isFreshlyCreated(item) {
  return item.updatedAt.getTime() - item.createdAt.getTime() < 2000
}

async function getRecentActivity() {
  const [contacts, projects, posts, team, services, jobs, applications] = await Promise.all([
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.project.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.post.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.teamMember.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.service.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.job.findMany({ orderBy: { updatedAt: 'desc' }, take: 5 }),
    prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { job: { select: { title: true } } } }),
  ])

  const events = [
    ...contacts.map(c => ({ icon: Mail, label: `New contact message from ${c.name}`, at: c.createdAt })),
    ...projects.map(p => ({ icon: Briefcase, label: `Project "${p.title}" ${isFreshlyCreated(p) ? 'added' : 'updated'}`, at: p.updatedAt })),
    ...posts.map(p => ({ icon: FileText, label: `Post "${p.title}" ${isFreshlyCreated(p) ? 'added' : 'updated'}`, at: p.updatedAt })),
    ...team.map(t => ({ icon: Users, label: `Team member "${t.name}" ${isFreshlyCreated(t) ? 'added' : 'updated'}`, at: t.updatedAt })),
    ...services.map(s => ({ icon: Sparkles, label: `Service "${s.title}" ${isFreshlyCreated(s) ? 'added' : 'updated'}`, at: s.updatedAt })),
    ...jobs.map(j => ({ icon: GraduationCap, label: `Job "${j.title}" ${isFreshlyCreated(j) ? 'added' : 'updated'}`, at: j.updatedAt })),
    ...applications.map(a => ({ icon: FileUser, label: `${a.name} applied for "${a.job?.title || 'a job'}"`, at: a.createdAt })),
  ]

  return events.sort((a, b) => b.at - a.at).slice(0, 6)
}

function formatRelativeTime(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function AdminDashboard() {
  const session = await auth()
  const greetingName = session?.user?.name || session?.user?.email?.split('@')[0] || 'there'

  const [counts, activity] = await Promise.all([getCounts(), getRecentActivity()])

  const cards = [
    { label: 'Projects', value: counts.projects, icon: Briefcase, color: '#C084FC', href: '/admin/portfolio' },
    { label: 'Services', value: counts.services, icon: Sparkles, color: '#60A5FA', href: '/admin/services' },
    { label: 'Clients', value: counts.clients, icon: Building2, color: '#34D399', href: null },
    { label: 'Messages', value: counts.messages, icon: Mail, color: '#F472B6', href: '/admin/contacts' },
    { label: 'Employees', value: counts.employees, icon: Users, color: '#FBBF24', href: '/admin/employees' },
    { label: 'Open Jobs', value: counts.jobs, icon: GraduationCap, color: '#818CF8', href: '/admin/careers' },
    { label: 'Applications', value: counts.applications, icon: FileUser, color: '#FB923C', href: '/admin/applications' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.35rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Welcome back, {greetingName}</p>

      <div className="admin-grid-stats" style={{ marginBottom: '2.5rem' }}>
        {cards.map(card => {
          const Icon = card.icon
          const content = (
            <>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                background: `${card.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={card.color} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>{card.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.15rem' }}>{card.label}</div>
              </div>
            </>
          )
          return card.href ? (
            <Link key={card.label} href={card.href} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit' }}>
              {content}
            </Link>
          ) : (
            <div key={card.label} className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {content}
            </div>
          )
        })}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '1rem' }}>Recent Activity</h2>
      <div className="admin-card" style={{ padding: activity.length === 0 ? '1.5rem' : '0.5rem 1.5rem' }}>
        {activity.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No activity yet.</p>}
        <ul style={{ listStyle: 'none' }}>
          {activity.map((event, i) => {
            const Icon = event.icon
            return (
              <li
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.85rem 0',
                  borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color="var(--text-secondary)" strokeWidth={2} />
                </div>
                <span style={{ fontSize: '0.88rem', flex: 1 }}>{event.label}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {formatRelativeTime(event.at)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

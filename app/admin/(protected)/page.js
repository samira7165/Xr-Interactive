import Link from 'next/link'
import {
  Briefcase, Sparkles, Mail, FileText, Users, GraduationCap, FileUser, Eye,
  TrendingUp, TrendingDown,
} from 'lucide-react'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import TrendChart from './TrendChart'

const DAY_MS = 24 * 60 * 60 * 1000

function dayKey(date) {
  return date.toISOString().slice(0, 10)
}

function bucketByDay(dates, days) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const buckets = new Map()
  for (let i = days - 1; i >= 0; i--) {
    buckets.set(dayKey(new Date(today.getTime() - i * DAY_MS)), 0)
  }
  for (const date of dates) {
    const key = dayKey(date)
    if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1)
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }))
}

async function getMetric(model) {
  const sixtyDaysAgo = new Date(Date.now() - 60 * DAY_MS)
  const [total, recentRows] = await Promise.all([
    model.count(),
    model.findMany({ where: { createdAt: { gte: sixtyDaysAgo } }, select: { createdAt: true } }),
  ])
  const days = bucketByDay(recentRows.map(r => r.createdAt), 60)
  const last30 = days.slice(30).reduce((sum, d) => sum + d.count, 0)
  const prev30 = days.slice(0, 30).reduce((sum, d) => sum + d.count, 0)
  const deltaPct = prev30 > 0 ? Math.round(((last30 - prev30) / prev30) * 1000) / 10 : null

  return { total, deltaPct, days }
}

async function getTopPages() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * DAY_MS)
  const rows = await prisma.pageView.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { path: true },
  })
  const counts = new Map()
  for (const { path } of rows) counts.set(path, (counts.get(path) || 0) + 1)
  return Array.from(counts.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
}

function isFreshlyCreated(item) {
  return item.updatedAt.getTime() - item.createdAt.getTime() < 2000
}

async function getRecentActivity() {
  const [contacts, projects, posts, team, services, jobs, applications] = await Promise.all([
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { name: true, createdAt: true } }),
    prisma.project.findMany({
      orderBy: { updatedAt: 'desc' }, take: 5,
      select: { id: true, title: true, category: true, thumbnail: true, createdAt: true, updatedAt: true },
    }),
    prisma.post.findMany({ orderBy: { updatedAt: 'desc' }, take: 5, select: { title: true, createdAt: true, updatedAt: true } }),
    prisma.teamMember.findMany({ orderBy: { updatedAt: 'desc' }, take: 5, select: { name: true, createdAt: true, updatedAt: true } }),
    prisma.service.findMany({ orderBy: { updatedAt: 'desc' }, take: 5, select: { title: true, createdAt: true, updatedAt: true } }),
    prisma.job.findMany({ orderBy: { updatedAt: 'desc' }, take: 5, select: { title: true, createdAt: true, updatedAt: true } }),
    prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' }, take: 5,
      select: { name: true, createdAt: true, job: { select: { title: true } } },
    }),
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

  return {
    events: events.sort((a, b) => b.at - a.at).slice(0, 6),
    recentProjects: projects.slice(0, 4),
  }
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

function Sparkline({ days }) {
  const width = 100
  const height = 32
  const max = Math.max(1, ...days.map(d => d.count))
  const points = days.map((d, i) => {
    const x = (i / (days.length - 1)) * width
    const y = height - (d.count / max) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height: '32px', display: 'block' }}>
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0.85" />
    </svg>
  )
}

function DeltaBadge({ deltaPct }) {
  if (deltaPct === null) return null
  const isUp = deltaPct >= 0
  const Icon = isUp ? TrendingUp : TrendingDown
  const color = isUp ? '#0ca30c' : '#e66767'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 600, color }}>
      <Icon size={12} strokeWidth={2.5} />
      {Math.abs(deltaPct)}%
    </span>
  )
}

const BREAKDOWN_COLORS = ['#3987e5', '#008300', '#d55181', '#c98500', '#199e70']

export default async function AdminDashboard() {
  const session = await auth()
  const greetingName = session?.user?.name || session?.user?.email?.split('@')[0] || 'there'

  const [
    pageViews, applications, projects, messages, teamMembers,
    topPages, { events, recentProjects }, postCount, jobCount, serviceCount,
  ] = await Promise.all([
    getMetric(prisma.pageView),
    getMetric(prisma.jobApplication),
    getMetric(prisma.project),
    getMetric(prisma.contact),
    getMetric(prisma.teamMember),
    getTopPages(),
    getRecentActivity(),
    prisma.post.count(),
    prisma.job.count(),
    prisma.service.count(),
  ])

  const cards = [
    { label: 'Site Visits', metric: pageViews, icon: Eye, href: null },
    { label: 'Applications', metric: applications, icon: FileUser, href: '/admin/applications' },
    { label: 'Projects', metric: projects, icon: Briefcase, href: '/admin/portfolio' },
    { label: 'Messages', metric: messages, icon: Mail, href: '/admin/contacts' },
    { label: 'Team Members', metric: teamMembers, icon: Users, href: '/admin/team' },
  ]

  const contentBreakdown = [
    { label: 'Projects', count: projects.total },
    { label: 'Services', count: serviceCount },
    { label: 'Blog Posts', count: postCount },
    { label: 'Team Members', count: teamMembers.total },
    { label: 'Open Jobs', count: jobCount },
  ]

  const breakdownTotal = Math.max(1, contentBreakdown.reduce((s, c) => s + c.count, 0))
  const maxPageViews = Math.max(1, ...topPages.map(p => p.views))

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.35rem' }}>
        Welcome back, {greetingName} 👋
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Here&rsquo;s what&rsquo;s happening with your site&rsquo;s content and traffic.</p>

      <div className="admin-grid-stats" style={{ marginBottom: '1.5rem' }}>
        {cards.map(card => {
          const Icon = card.icon
          const content = (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(192,132,252,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={19} color="var(--accent)" strokeWidth={2} />
                </div>
                <DeltaBadge deltaPct={card.metric.deltaPct} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                {card.metric.total.toLocaleString()}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.15rem', marginBottom: '0.5rem' }}>
                {card.label}
              </div>
              <Sparkline days={card.metric.days.slice(-14)} />
            </>
          )
          return card.href ? (
            <Link key={card.label} href={card.href} className="admin-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              {content}
            </Link>
          ) : (
            <div key={card.label} className="admin-card">{content}</div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }} className="admin-dashboard-row">
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Site Visits</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Last 30 days</span>
          </div>
          <TrendChart data={pageViews.days.slice(-30)} />
        </div>

        <div className="admin-card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Top Pages</h2>
          {topPages.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No visits recorded yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {topPages.map(page => (
              <div key={page.path}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.path}</span>
                  <span style={{ color: 'var(--text-secondary)', flexShrink: 0, marginLeft: '0.5rem' }}>{page.views}</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(page.views / maxPageViews) * 100}%`, background: 'var(--accent)', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem' }}>Content Breakdown</h2>
          <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
            {contentBreakdown.map((c, i) => c.count > 0 && (
              <div
                key={c.label}
                title={`${c.label}: ${c.count} (${Math.round((c.count / breakdownTotal) * 100)}%)`}
                style={{
                  width: `${(c.count / breakdownTotal) * 100}%`,
                  background: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length],
                  borderRight: i < contentBreakdown.length - 1 ? '2px solid var(--bg-card)' : 'none',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {contentBreakdown.map((c, i) => (
              <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length], flexShrink: 0 }} />
                <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{c.label}</span>
                <span style={{ fontWeight: 600 }}>{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.25rem' }} className="admin-dashboard-row">
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: '1rem' }}>Recent Activity</h2>
          <div className="admin-card" style={{ padding: events.length === 0 ? '1.5rem' : '0.5rem 1.5rem' }}>
            {events.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No activity yet.</p>}
            <ul style={{ listStyle: 'none' }}>
              {events.map((event, i) => {
                const Icon = event.icon
                return (
                  <li
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.85rem',
                      padding: '0.85rem 0',
                      borderBottom: i < events.length - 1 ? '1px solid var(--border)' : 'none',
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

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Recent Projects</h2>
            <Link href="/admin/portfolio" style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none' }}>View all</Link>
          </div>
          <div className="admin-card" style={{ padding: recentProjects.length === 0 ? '1.5rem' : '0.5rem 1.5rem' }}>
            {recentProjects.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No projects yet.</p>}
            <ul style={{ listStyle: 'none' }}>
              {recentProjects.map((project, i) => (
                <li
                  key={project.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                    padding: '0.75rem 0',
                    borderBottom: i < recentProjects.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                    {project.thumbnail && (
                      <img src={project.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.category}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {formatRelativeTime(project.updatedAt)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .admin-dashboard-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

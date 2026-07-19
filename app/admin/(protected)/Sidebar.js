'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Mail, FileText, Briefcase, Sparkles, Users, GraduationCap, FileUser,
  Settings, Menu, X,
} from 'lucide-react'

const navGroups = [
  { items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }] },
  {
    label: 'Management',
    items: [
      { href: '/admin/contacts', label: 'Contacts', icon: Mail, badgeKey: 'contacts' },
      { href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
      { href: '/admin/services', label: 'Services', icon: Sparkles },
      { href: '/admin/team', label: 'Team Members', icon: Users },
      { href: '/admin/careers', label: 'Careers', icon: GraduationCap },
      { href: '/admin/applications', label: 'Applications', icon: FileUser },
    ],
  },
  {
    label: 'Content',
    items: [{ href: '/admin/blog', label: 'Blog', icon: FileText }],
  },
  {
    label: 'System',
    items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
  },
]

export default function Sidebar({ userLabel, userImage, badges = {} }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <div className="admin-sidebar-root">
      <div className="admin-mobile-topbar">
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/logo.png" alt="XRI" width={28} height={28} style={{ objectFit: 'contain' }} priority />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-primary)', cursor: 'pointer',
          }}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && <div className="admin-mobile-backdrop" onClick={() => setMobileOpen(false)} />}

      <aside className={`admin-sidebar ${mobileOpen ? 'admin-sidebar-open' : ''}`} style={{
        background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem',
      }}>
        <div style={{ padding: '0 0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="admin-sidebar-brand">
          <Image src="/logo.png" alt="XRI" width={32} height={32} style={{ objectFit: 'contain' }} priority />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>Admin</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, overflowY: 'auto' }}>
          {navGroups.map((group, gi) => (
            <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {group.label && (
                <div style={{
                  fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', padding: '0 0.75rem', marginBottom: '0.15rem',
                }}>
                  {group.label}
                </div>
              )}
              {group.items.map(item => {
                const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                const Icon = item.icon
                const badge = item.badgeKey ? badges[item.badgeKey] : null
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                      padding: '0.6rem 0.75rem', borderRadius: '8px',
                      fontSize: '0.9rem', fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-card-hover)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    <Icon size={17} strokeWidth={2} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {badge > 0 && (
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, color: '#fff', background: 'var(--accent)',
                        borderRadius: '999px', padding: '0.05rem 0.45rem', lineHeight: 1.5,
                      }}>
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <Link
          href="/admin/settings"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.5rem',
            borderRadius: '10px', textDecoration: 'none', marginTop: '1rem',
            background: pathname === '/admin/settings' ? 'var(--bg-card-hover)' : 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          {userImage ? (
            <img
              src={userImage}
              alt=""
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {userLabel?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userLabel}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View profile</div>
          </div>
        </Link>
      </aside>

      <style>{`
        .admin-sidebar-root { flex-shrink: 0; }
        .admin-mobile-topbar { display: none; }
        .admin-mobile-backdrop {
          display: none;
        }
        .admin-sidebar {
          width: 240px; flex-shrink: 0; height: 100%; min-height: 100vh;
        }

        @media (max-width: 900px) {
          .admin-mobile-topbar {
            display: flex; align-items: center; justify-content: space-between;
            padding: 0.85rem 1.25rem; background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
            position: fixed; top: 0; left: 0; right: 0; z-index: 110;
          }
          .admin-sidebar-brand { display: none; }
          .admin-mobile-backdrop {
            display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.55);
            z-index: 90; backdrop-filter: blur(2px);
          }
          .admin-sidebar {
            position: fixed; top: 0; left: 0; height: 100vh; z-index: 100;
            width: 80vw; max-width: 300px;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 8px 0 24px rgba(0,0,0,0.35);
            padding-top: calc(1.5rem + 56px) !important;
          }
          .admin-sidebar-open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

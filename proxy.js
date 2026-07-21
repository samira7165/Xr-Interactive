import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublicAdminPage = pathname === '/admin/login'
  // Server Action submissions (identified by this header) are already
  // protected by each protected page/layout's own `auth()` check — gating
  // them here too has been seen to misfire and redirect logged-in users to
  // login mid-submission, so defer to the page-level check for these.
  const isServerAction = req.headers.has('next-action')

  if (!req.auth && !isPublicAdminPage && !isServerAction) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  // Creating admin accounts and managing team members (who appears on the
  // public site) are SUPER_ADMIN-only. Server Action requests are exempted
  // from this redirect for the same reason as above — the team Server
  // Action and API routes re-check the role themselves.
  const isSuperAdminOnlyRoute = pathname === '/admin/signup' || pathname.startsWith('/admin/team')
  if (isSuperAdminOnlyRoute && !isServerAction && req.auth?.user?.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}

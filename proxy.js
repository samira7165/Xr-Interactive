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

  // Creating new admin accounts is a SUPER_ADMIN-only action.
  if (pathname === '/admin/signup' && req.auth?.user?.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}

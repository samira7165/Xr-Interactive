import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublicAdminPage = pathname === '/admin/login'

  if (!req.auth && !isPublicAdminPage) {
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

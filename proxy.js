import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublicAdminPage = pathname === '/admin/login' || pathname === '/admin/signup'

  if (!req.auth && !isPublicAdminPage) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}

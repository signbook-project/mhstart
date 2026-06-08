import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin/* routes (not /admin/login, not /api/*)
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('mhstart_admin_token')?.value
  if (!token || !verifyToken(token)) {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

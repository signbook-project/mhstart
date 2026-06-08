import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/auth'

export async function withAdminAuth(req: NextRequest, handler: (req: NextRequest, admin: any) => Promise<NextResponse>) {
  const admin = await getAdminFromRequest(req)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return handler(req, admin)
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const { data: admin } = await supabaseAdmin.from('admin_users').select('*').eq('email', email).single()

    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await verifyPassword(password, admin.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: admin.id, email: admin.email })
    const res = NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
    const cookie = setAuthCookie(token)
    res.cookies.set(cookie)
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

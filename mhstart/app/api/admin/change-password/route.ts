import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'
import { hashPassword, verifyPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req, admin) => {
    const { current_password, new_password } = await req.json()
    const { data: adminData } = await supabaseAdmin.from('admin_users').select('password_hash').eq('id', admin.id).single()
    const valid = await verifyPassword(current_password, adminData?.password_hash || '')
    if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 })
    const newHash = await hashPassword(new_password)
    await supabaseAdmin.from('admin_users').update({ password_hash: newHash, updated_at: new Date().toISOString() }).eq('id', admin.id)
    return NextResponse.json({ success: true })
  })
}

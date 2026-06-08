import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'
import { hashPassword, verifyPassword } from '@/lib/auth'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { data } = await supabaseAdmin.from('settings').select('*')
    const settings: Record<string, any> = {}
    data?.forEach((s: any) => { settings[s.key] = s.value })
    return NextResponse.json({ data: settings })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    const { key, value } = body
    const { error } = await supabaseAdmin.from('settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  })
}

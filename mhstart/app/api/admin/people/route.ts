import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { data, error } = await supabaseAdmin.from('people').select('*').order('order_index').order('created_at')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('people').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

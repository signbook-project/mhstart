import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    let query = supabaseAdmin.from('map_listings').select('*').order('submitted_at', { ascending: false })
    if (status && status !== 'all') query = query.eq('status', status)
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    const { data, error } = await supabaseAdmin.from('map_listings').insert({ ...body, status: 'active' }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'
import slugify from 'slugify'

// GET /api/admin/news - list all news (admin)
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    let query = supabaseAdmin.from('news').select('*').order('created_at', { ascending: false })
    if (status && status !== 'all') query = query.eq('status', status)
    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

// POST /api/admin/news - create news (admin)
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    const slug = slugify(body.title, { lower: true, strict: true }) + '-' + Date.now()
    const { data, error } = await supabaseAdmin.from('news').insert({
      ...body, slug,
      status: body.status || 'published',
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

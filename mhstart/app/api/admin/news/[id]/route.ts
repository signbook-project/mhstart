import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async () => {
    const { data, error } = await supabaseAdmin.from('news').select('*').eq('id', params.id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ data })
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    if (body.status === 'published' && !body.published_at) body.published_at = new Date().toISOString()
    const { data, error } = await supabaseAdmin.from('news').update({ ...body, updated_at: new Date().toISOString() }).eq('id', params.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async () => {
    const { error } = await supabaseAdmin.from('news').delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { data, error } = await supabaseAdmin
      .from('spotlight')
      .select('*, listing:map_listings(*)')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    // .single() throws if no row; return null gracefully
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data: data || null })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    // Deactivate all existing spotlights first
    await supabaseAdmin.from('spotlight').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')
    const { data, error } = await supabaseAdmin
      .from('spotlight')
      .insert({ ...body, is_active: true })
      .select('*, listing:map_listings(*)')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

export async function PATCH(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const { data, error } = await supabaseAdmin
      .from('spotlight')
      .update(rest)
      .eq('id', id)
      .select('*, listing:map_listings(*)')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

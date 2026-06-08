import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async (req) => {
    const body = await req.json()
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async () => {
    const { error } = await supabaseAdmin
      .from('contact_submissions')
      .delete()
      .eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  })
}

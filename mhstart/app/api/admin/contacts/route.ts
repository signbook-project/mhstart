import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'

// GET /api/admin/contacts - list all (admin only)
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const { data, error } = await supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  })
}

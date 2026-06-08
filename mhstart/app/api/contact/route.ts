import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/contact — public contact form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }
    const { error } = await supabaseAdmin.from('contact_submissions').insert({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      subject: body.subject || null,
      message: body.message,
      status: 'new',
    })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

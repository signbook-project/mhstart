import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const SETTINGS_KEY = 'news_senders'

// GET /api/admin/news-senders — list allowed emails
export async function GET() {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', SETTINGS_KEY)
    .single()
  return NextResponse.json({ data: data?.value || [] })
}

// POST /api/admin/news-senders — add one email to the list
// body: { email: string }
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }
    const clean = email.trim().toLowerCase()

    const { data: existing } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .single()

    const list: string[] = existing?.value || []
    if (!list.includes(clean)) list.push(clean)

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ key: SETTINGS_KEY, value: list }, { onConflict: 'key' })

    if (error) throw error
    return NextResponse.json({ success: true, data: list })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE /api/admin/news-senders — remove one email
// body: { email: string }
export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json()
    const clean = (email || '').trim().toLowerCase()

    const { data: existing } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', SETTINGS_KEY)
      .single()

    const list: string[] = (existing?.value || []).filter((e: string) => e !== clean)

    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ key: SETTINGS_KEY, value: list }, { onConflict: 'key' })

    if (error) throw error
    return NextResponse.json({ success: true, data: list })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
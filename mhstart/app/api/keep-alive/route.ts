
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

//add new changes....

export async function GET() {

  // Any lightweight query on a real table
  const { error } = await supabaseAdmin.from('contact_submissions').select('id').limit(1)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, time: new Date().toISOString() })
}
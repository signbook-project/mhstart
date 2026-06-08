import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

// GET /api/admin/setup — create initial admin if none exists
export async function GET() {
  const { data: existing } = await supabaseAdmin.from('admin_users').select('id').limit(1)
  if (existing && existing.length > 0) return NextResponse.json({ message: 'Admin already exists' })

  const hash = await hashPassword('Billionapps@100!')
  const { error } = await supabaseAdmin.from('admin_users').insert({ email: 'admin@mhstart.com', password_hash: hash, name: 'Admin' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: 'Admin created: admin@mhstart.com / Billionapps@100!' })
}

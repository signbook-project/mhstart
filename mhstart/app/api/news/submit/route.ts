import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import slugify from 'slugify'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const slug = slugify(body.title || 'article', { lower: true, strict: true }) + '-' + Date.now()
    const tags = body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    const { error } = await supabaseAdmin.from('news').insert({
      title: body.title, slug, excerpt: body.excerpt, content: body.content,
      cover_image: body.cover_image || null, author_name: body.author_name, author_email: body.author_email,
      status: 'pending', submitted_by_type: 'user', tags,
    })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

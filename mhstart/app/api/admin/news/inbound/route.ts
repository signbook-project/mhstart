import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/news/inbound — Mailgun inbound route webhook.
// Only senders on the "News Auto-Publish — Allowed Senders" admin list
// (settings key: news_senders) get published. Anyone else's email is
// silently ignored — nothing is saved, nothing is published.

function verifyMailgunSignature(timestamp: string, token: string, signature: string) {
  const signingKey = process.env.MAILGUN_SIGNING_KEY
  if (!signingKey) return false
  const hmac = crypto.createHmac('sha256', signingKey)
  hmac.update(timestamp + token)
  return hmac.digest('hex') === signature
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now()
  )
}

// Extracts a plain email address from a "From" header that may look like
// "Bhushan Sir <bhushan@mhstart.com>" or just "bhushan@mhstart.com"
function extractEmail(raw: string) {
  const match = raw.match(/<([^>]+)>/)
  return (match ? match[1] : raw).trim().toLowerCase()
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const timestamp = form.get('timestamp') as string
    const token = form.get('token') as string
    const signature = form.get('signature') as string

    if (!verifyMailgunSignature(timestamp, token, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const rawSender = (form.get('sender') as string) || ''
    const senderEmail = extractEmail(rawSender)

    // Check sender against the admin-managed allowlist
    const { data: settingsRow } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'news_senders')
      .single()

    const allowedSenders: string[] = settingsRow?.value || []

    if (!allowedSenders.includes(senderEmail)) {
      // Not an approved sender — ignore silently. Return 200 so Mailgun
      // doesn't retry, but nothing is published or saved.
      console.log(`Ignored inbound news email from unapproved sender: ${senderEmail}`)
      return NextResponse.json({ success: false, reason: 'sender not approved' })
    }

    const subject = (form.get('subject') as string) || 'Untitled'
    const bodyPlain = (form.get('body-plain') as string) || ''

    const contentHtml = bodyPlain
      .split(/\n\s*\n/)
      .filter((p) => p.trim())
      .map((p) => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
      .join('\n')

    const excerpt = bodyPlain.trim().slice(0, 180)

    let coverImageUrl: string | null = null
    const attachmentCount = Number(form.get('attachment-count') || 0)
    for (let i = 1; i <= attachmentCount; i++) {
      const file = form.get(`attachment-${i}`) as File | null
      if (file && file.type?.startsWith('image/')) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const path = `news-inbound/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabaseAdmin.storage
          .from('news-images')
          .upload(path, buffer, { contentType: file.type })
        if (!uploadError) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('news-images')
            .getPublicUrl(path)
          coverImageUrl = publicUrlData.publicUrl
        }
        break
      }
    }

    const slug = slugify(subject)

    const { error } = await supabaseAdmin.from('news').insert({
      title: subject,
      slug,
      content: contentHtml,
      excerpt,
      cover_image: coverImageUrl,
      author_name: senderEmail,
      status: 'published',
      published_at: new Date().toISOString(),
      is_pinned: false,
    })

    if (error) throw error

    return NextResponse.json({ success: true, slug })
  } catch (err: any) {
    console.error('Inbound news webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
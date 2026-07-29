export const runtime = 'nodejs'


import { supabaseAdmin } from '@/lib/supabase'
import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import { NextRequest, NextResponse } from 'next/server'

const SETTINGS_KEY = 'news_senders'

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

function extractEmail(raw: string) {
  const match = raw.match(/<([^>]+)>/)
  return (match ? match[1] : raw).trim().toLowerCase()
}

// GET /api/cron/process-news-emails
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT || 993),
    secure: true,
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASSWORD!,
    },
    socketTimeout: 20_000,
    greetingTimeout: 15_000,
  })

  const results: any[] = []

  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')

    try {
      // Get just the list of unseen UIDs first — lightweight, no bodies
    // Get just the list of unseen UIDs first — lightweight, no bodies
      const searchResult = await client.search({ seen: false }, { uid: true })
      const uids: number[] = searchResult || []

      const { data: settingsRow } = await supabaseAdmin
        .from('settings')
        .select('value')
        .eq('key', SETTINGS_KEY)
        .single()
      const allowedSenders: string[] = settingsRow?.value || []

      for (const uid of uids) {
        try {
          // Fetch ONE message at a time — isolates any stalled/bad message
          const msg = await client.fetchOne(
            String(uid),
            { envelope: true, source: true },
            { uid: true }
          )

          if (!msg || !msg.source) {
            results.push({ uid, action: 'skipped-no-source' })
            continue
          }

          const parsed = await simpleParser(msg.source)
          const senderEmail = extractEmail(parsed.from?.text || '')

          if (!allowedSenders.includes(senderEmail)) {
            results.push({ uid, senderEmail, action: 'skipped-not-allowed' })
            await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true })
            continue
          }

          const subject = parsed.subject || 'Untitled'
          const bodyPlain = parsed.text || ''
          const contentHtml = bodyPlain
            .split(/\n\s*\n/)
            .filter((p) => p.trim())
            .map((p) => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
            .join('\n')
          const excerpt = bodyPlain.trim().slice(0, 180)

          let coverImageUrl: string | null = null
          const imageAttachment = parsed.attachments?.find((a) =>
            a.contentType?.startsWith('image/')
          )
          if (imageAttachment) {
            const path = `news-inbound/${Date.now()}-${imageAttachment.filename || 'image'}`
            const { error: uploadError } = await supabaseAdmin.storage
              .from('news-images')
              .upload(path, imageAttachment.content, {
                contentType: imageAttachment.contentType,
              })
            if (!uploadError) {
              const { data: publicUrlData } = supabaseAdmin.storage
                .from('news-images')
                .getPublicUrl(path)
              coverImageUrl = publicUrlData.publicUrl
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

          await client.messageFlagsAdd(uid, ['\\Seen'], { uid: true })

          results.push({
            uid,
            senderEmail,
            action: error ? 'error' : 'published',
            error: error?.message,
            slug,
          })
        } catch (msgErr: any) {
          console.error(`Error processing uid=${uid}:`, msgErr)
          results.push({ uid, action: 'error', error: msgErr.message })
          // Connection may be unstable here — don't attempt more calls,
          // just move to the next UID
        }
      }
    } finally {
      lock.release()
    }

    await client.logout()
    return NextResponse.json({ success: true, processed: results.length, results })
  } catch (err: any) {
    console.error('IMAP cron error:', err)
    try {
      client.close()
    } catch {}
    return NextResponse.json({ error: err.message, partialResults: results }, { status: 500 })
  }
}
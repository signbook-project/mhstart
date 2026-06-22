import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'
import { parseExcelSheet, isValidUrl, isValidEmail, splitCsv, parseYesNo, type RowResult } from '@/lib/bulkUpload'
import slugify from 'slugify'

const VALID_STATUS = ['pending', 'published', 'rejected']

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    try {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

      const buffer = await file.arrayBuffer()
      const rows = parseExcelSheet(buffer, 'News Data')

      if (rows.length === 0) {
        return NextResponse.json({ error: 'No data rows found. Make sure you used the correct template and filled the "News Data" sheet.' }, { status: 400 })
      }

      const results: RowResult[] = []
      const toInsert: any[] = []

      rows.forEach((row, idx) => {
        const rowNum = idx + 2 // header is row 1
        const title = String(row['Title'] || '').trim()
        const excerpt = String(row['Excerpt'] || '').trim()
        const content = String(row['Content'] || '').trim()
        const coverImage = String(row['Cover Image URL'] || '').trim()
        const authorName = String(row['Author Name'] || '').trim()
        const authorEmail = String(row['Author Email'] || '').trim()
        const tagsRaw = row['Tags']
        const statusRaw = String(row['Status'] || '').trim().toLowerCase()
        const pinnedRaw = row['Pinned (Yes/No)']

        // Validation
        if (!title) return results.push({ row: rowNum, success: false, error: 'Title is required' })
        if (!excerpt) return results.push({ row: rowNum, success: false, error: 'Excerpt is required' })
        if (!content) return results.push({ row: rowNum, success: false, error: 'Content is required' })
        if (!authorName) return results.push({ row: rowNum, success: false, error: 'Author Name is required' })
        if (coverImage && !isValidUrl(coverImage)) return results.push({ row: rowNum, success: false, error: 'Cover Image URL must start with http:// or https://' })
        if (authorEmail && !isValidEmail(authorEmail)) return results.push({ row: rowNum, success: false, error: 'Author Email is not a valid email address' })
        if (statusRaw && !VALID_STATUS.includes(statusRaw)) return results.push({ row: rowNum, success: false, error: `Status must be one of: ${VALID_STATUS.join(', ')}` })

        const status = statusRaw || 'pending'
        const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now() + '-' + idx

        toInsert.push({
          title, excerpt, content,
          cover_image: coverImage || null,
          author_name: authorName,
          author_email: authorEmail || null,
          tags: splitCsv(tagsRaw),
          status,
          is_pinned: parseYesNo(pinnedRaw, false),
          submitted_by_type: 'admin',
          slug,
          published_at: status === 'published' ? new Date().toISOString() : null,
          _rowNum: rowNum,
        })
      })

      // Bulk insert valid rows
      if (toInsert.length > 0) {
        const rowMeta = toInsert.map(r => r._rowNum)
        const payload = toInsert.map(({ _rowNum, ...rest }) => rest)
        const { data, error } = await supabaseAdmin.from('news').insert(payload).select('id, title')

        if (error) {
          // If bulk insert fails entirely, report all as failed
          toInsert.forEach((r, i) => {
            results.push({ row: r._rowNum, success: false, error: error.message })
          })
        } else {
          data?.forEach((d: any, i: number) => {
            results.push({ row: rowMeta[i], success: true, data: { id: d.id, title: d.title } })
          })
        }
      }

      results.sort((a, b) => a.row - b.row)
      const success = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return NextResponse.json({
        total: rows.length, success, failed, results,
      })
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed to process file' }, { status: 500 })
    }
  })
}

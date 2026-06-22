import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'
import { parseExcelSheet, isValidUrl, isValidEmail, parseYesNo, parseIntOrNull, type RowResult } from '@/lib/bulkUpload'

const VALID_CATEGORIES = ['team', 'founding_member', 'advisor', 'supported_by', 'partner']

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    try {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

      const buffer = await file.arrayBuffer()
      const rows = parseExcelSheet(buffer, 'People Data')

      if (rows.length === 0) {
        return NextResponse.json({ error: 'No data rows found. Make sure you used the correct template and filled the "People Data" sheet.' }, { status: 400 })
      }

      const results: RowResult[] = []
      const toInsert: any[] = []

      rows.forEach((row, idx) => {
        const rowNum = idx + 2
        const name = String(row['Name'] || '').trim()
        const role = String(row['Role'] || '').trim()
        const organization = String(row['Organization'] || '').trim()
        const category = String(row['Category'] || '').trim().toLowerCase()
        const bio = String(row['Bio'] || '').trim()
        const photoUrl = String(row['Photo URL'] || '').trim()
        const email = String(row['Email'] || '').trim()
        const linkedin = String(row['LinkedIn'] || '').trim()
        const twitter = String(row['Twitter'] || '').trim()
        const website = String(row['Website'] || '').trim()
        const orderIndex = row['Display Order']
        const visibleRaw = row['Visible (Yes/No)']

        if (!name) return results.push({ row: rowNum, success: false, error: 'Name is required' })
        if (!category) return results.push({ row: rowNum, success: false, error: 'Category is required' })
        if (!VALID_CATEGORIES.includes(category)) return results.push({ row: rowNum, success: false, error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` })
        if (photoUrl && !isValidUrl(photoUrl)) return results.push({ row: rowNum, success: false, error: 'Photo URL must start with http:// or https://' })
        if (email && !isValidEmail(email)) return results.push({ row: rowNum, success: false, error: 'Email is not a valid email address' })

        toInsert.push({
          name, role: role || null, organization: organization || null, category,
          bio: bio || null, photo_url: photoUrl || null, email: email || null,
          linkedin: linkedin || null, twitter: twitter || null, website: website || null,
          order_index: parseIntOrNull(orderIndex) || 0,
          is_active: parseYesNo(visibleRaw, true),
          _rowNum: rowNum,
        })
      })

      if (toInsert.length > 0) {
        const rowMeta = toInsert.map(r => r._rowNum)
        const payload = toInsert.map(({ _rowNum, ...rest }) => rest)
        const { data, error } = await supabaseAdmin.from('people').insert(payload).select('id, name')

        if (error) {
          toInsert.forEach((r) => {
            results.push({ row: r._rowNum, success: false, error: error.message })
          })
        } else {
          data?.forEach((d: any, i: number) => {
            results.push({ row: rowMeta[i], success: true, data: { id: d.id, name: d.name } })
          })
        }
      }

      results.sort((a, b) => a.row - b.row)
      const success = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return NextResponse.json({ total: rows.length, success, failed, results })
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Failed to process file' }, { status: 500 })
    }
  })
}

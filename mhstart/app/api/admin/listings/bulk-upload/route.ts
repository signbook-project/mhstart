import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { withAdminAuth } from '@/lib/apiMiddleware'
import { parseExcelSheet, isValidUrl, isValidEmail, splitCsv, parseNumberOrNull, parseIntOrNull, type RowResult } from '@/lib/bulkUpload'

const VALID_TYPES = ['startup', 'incubator', 'vc', 'accelerator', 'angel', 'government', 'corporate', 'other']
const VALID_STATUS = ['pending', 'active', 'paused', 'rejected']

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req) => {
    try {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

      const buffer = await file.arrayBuffer()
      const rows = parseExcelSheet(buffer, 'Listings Data')

      if (rows.length === 0) {
        return NextResponse.json({ error: 'No data rows found. Make sure you used the correct template and filled the "Listings Data" sheet.' }, { status: 400 })
      }

      const results: RowResult[] = []
      const toInsert: any[] = []

      rows.forEach((row, idx) => {
        const rowNum = idx + 2
        const name = String(row['Name'] || '').trim()
        const type = String(row['Type'] || '').trim().toLowerCase()
        const tagline = String(row['Tagline'] || '').trim()
        const description = String(row['Description'] || '').trim()
        const logoUrl = String(row['Logo URL'] || '').trim()
        const website = String(row['Website'] || '').trim()
        const contactName = String(row['Contact Name'] || '').trim()
        const email = String(row['Email'] || '').trim()
        const phone = String(row['Phone'] || '').trim()
        const address = String(row['Address'] || '').trim()
        const city = String(row['City'] || '').trim()
        const district = String(row['District'] || '').trim()
        const lat = row['Latitude']
        const lng = row['Longitude']
        const sectorsRaw = row['Sectors']
        const stage = String(row['Stage'] || '').trim()
        const teamSize = String(row['Team Size'] || '').trim()
        const foundedYear = row['Founded Year']
        const linkedin = String(row['LinkedIn'] || '').trim()
        const twitter = String(row['Twitter'] || '').trim()
        const instagram = String(row['Instagram'] || '').trim()
        const statusRaw = String(row['Status'] || '').trim().toLowerCase()

        // Validation
        if (!name) return results.push({ row: rowNum, success: false, error: 'Name is required' })
        if (!type) return results.push({ row: rowNum, success: false, error: 'Type is required' })
        if (!VALID_TYPES.includes(type)) return results.push({ row: rowNum, success: false, error: `Type must be one of: ${VALID_TYPES.join(', ')}` })
        if (!contactName) return results.push({ row: rowNum, success: false, error: 'Contact Name is required' })
        if (!email) return results.push({ row: rowNum, success: false, error: 'Email is required' })
        if (!isValidEmail(email)) return results.push({ row: rowNum, success: false, error: 'Email is not a valid email address' })
        if (!city) return results.push({ row: rowNum, success: false, error: 'City is required' })
        if (logoUrl && !isValidUrl(logoUrl)) return results.push({ row: rowNum, success: false, error: 'Logo URL must start with http:// or https://' })
        if (website && !isValidUrl(website)) return results.push({ row: rowNum, success: false, error: 'Website must start with http:// or https://' })
        if (statusRaw && !VALID_STATUS.includes(statusRaw)) return results.push({ row: rowNum, success: false, error: `Status must be one of: ${VALID_STATUS.join(', ')}` })

        const parsedLat = parseNumberOrNull(lat)
        const parsedLng = parseNumberOrNull(lng)
        if (lat && parsedLat === null) return results.push({ row: rowNum, success: false, error: 'Latitude must be a number' })
        if (lng && parsedLng === null) return results.push({ row: rowNum, success: false, error: 'Longitude must be a number' })

        toInsert.push({
          name, type, tagline: tagline || null, description: description || null,
          logo_url: logoUrl || null, website: website || null,
          contact_name: contactName, email, phone: phone || null,
          address: address || null, city, district: district || null,
          lat: parsedLat, lng: parsedLng,
          sector: splitCsv(sectorsRaw),
          stage: stage || null, team_size: teamSize || null,
          founded_year: parseIntOrNull(foundedYear),
          linkedin: linkedin || null, twitter: twitter || null, instagram: instagram || null,
          status: statusRaw || 'pending',
          _rowNum: rowNum,
        })
      })

      if (toInsert.length > 0) {
        const rowMeta = toInsert.map(r => r._rowNum)
        const payload = toInsert.map(({ _rowNum, ...rest }) => rest)
        const { data, error } = await supabaseAdmin.from('map_listings').insert(payload).select('id, name')

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

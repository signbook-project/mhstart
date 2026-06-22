import * as XLSX from 'xlsx';

export type RowResult = { row: number; success: boolean; error?: string; data?: any }
export type BulkUploadSummary = {
  total: number
  success: number
  failed: number
  results: RowResult[]
}

/** Parse an uploaded Excel file buffer into an array of row objects keyed by header. */
export function parseExcelSheet(buffer: ArrayBuffer, sheetName: string): Record<string, any>[] {
  const wb = XLSX.read(buffer, { type: 'array' })
  const sheet = wb.Sheets[sheetName] || wb.Sheets[wb.SheetNames[wb.SheetNames.length - 1]]
  if (!sheet) return []
  return XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false })
}

export function isValidUrl(value: string) {
  if (!value) return true
  return /^https?:\/\//i.test(value.trim())
}

export function isValidEmail(value: string) {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function splitCsv(value: any): string[] {
  if (!value) return []
  return String(value)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

export function parseYesNo(value: any, defaultVal = false): boolean {
  if (value === undefined || value === null || value === '') return defaultVal
  const v = String(value).trim().toLowerCase()
  return v === 'yes' || v === 'true' || v === '1'
}

export function parseNumberOrNull(value: any): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = parseFloat(value)
  return isNaN(n) ? null : n
}

export function parseIntOrNull(value: any): number | null {
  if (value === undefined || value === null || value === '') return null
  const n = parseInt(value, 10)
  return isNaN(n) ? null : n
}

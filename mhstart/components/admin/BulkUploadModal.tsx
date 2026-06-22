'use client'
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

type RowResult = { row: number; success: boolean; error?: string; data?: any }
type UploadSummary = { total: number; success: number; failed: number; results: RowResult[] }

export default function BulkUploadModal({
  title, templateUrl, uploadUrl, onClose, onComplete,
}: {
  title: string
  templateUrl: string
  uploadUrl: string
  onClose: () => void
  onComplete: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [summary, setSummary] = useState<UploadSummary | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const pickFile = (f: File | null) => {
    if (!f) return
    const validExt = /\.(xlsx|xls)$/i.test(f.name)
    if (!validExt) { toast.error('Please upload an .xlsx or .xls file'); return }
    setFile(f)
    setSummary(null)
  }

  const upload = async () => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(uploadUrl, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Upload failed')
        setUploading(false)
        return
      }
      setSummary(data)
      if (data.success > 0) {
        toast.success(`${data.success} row${data.success !== 1 ? 's' : ''} imported successfully!`)
        onComplete()
      }
      if (data.failed > 0) {
        toast.error(`${data.failed} row${data.failed !== 1 ? 's' : ''} failed — see details below`)
      }
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const reset = () => { setFile(null); setSummary(null) }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'auto', padding: '32px 16px' }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 620, padding: 36, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--gray-400)' }}>✕</button>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--navy)', marginBottom: 6 }}>📤 {title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
          Upload multiple records at once using our Excel template.
        </p>

        {/* Step 1: Download template */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--gray-50)', borderRadius: 12, padding: 18, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(10,36,99,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>1️⃣</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>Download the template</p>
            <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Includes instructions, example rows and dropdown validation</p>
          </div>
          <a href={templateUrl} download className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px', whiteSpace: 'nowrap' }}>
            ⬇ Download
          </a>
        </div>

        {/* Step 2: Upload */}
        {!summary && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,107,53,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>2️⃣</div>
              <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>Upload your filled template</p>
            </div>

            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0] || null) }}
              style={{
                border: `2px dashed ${dragOver ? 'var(--saffron)' : 'var(--gray-200)'}`,
                borderRadius: 14, padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(255,107,53,0.04)' : 'white', transition: 'all 0.15s',
              }}
            >
              <input ref={inputRef} type="file" accept=".xlsx,.xls" hidden onChange={e => pickFile(e.target.files?.[0] || null)} />
              {file ? (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                  <p style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{file.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{(file.size / 1024).toFixed(0)} KB · Click to choose a different file</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 14 }}>Click to browse or drag & drop your .xlsx file here</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Results summary */}
        {summary && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <SummaryStat label="Total Rows" value={summary.total} color="var(--navy)" />
              <SummaryStat label="Imported" value={summary.success} color="var(--green)" />
              <SummaryStat label="Failed" value={summary.failed} color={summary.failed > 0 ? '#EF4444' : 'var(--gray-400)'} />
            </div>

            {summary.failed > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>⚠️ Rows with errors:</p>
                <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid var(--gray-100)', borderRadius: 10 }}>
                  {summary.results.filter(r => !r.success).map((r, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 10, fontSize: 13 }}>
                      <span style={{ fontWeight: 700, color: '#EF4444', flexShrink: 0 }}>Row {r.row}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summary.success > 0 && (
              <div style={{ marginTop: summary.failed > 0 ? 16 : 0, padding: 14, background: 'rgba(45,106,79,0.08)', borderRadius: 10, border: '1px solid rgba(45,106,79,0.2)' }}>
                <p style={{ fontSize: 13, color: '#1E4D38' }}>✅ {summary.success} record{summary.success !== 1 ? 's' : ''} imported successfully.</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {summary ? (
            <>
              <button className="btn btn-outline" onClick={reset}>Upload Another File</button>
              <button className="btn btn-primary" onClick={onClose}>Done</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={upload} disabled={!file || uploading}>
                {uploading ? 'Uploading...' : '📤 Upload & Import'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SummaryStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, background: 'var(--gray-50)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

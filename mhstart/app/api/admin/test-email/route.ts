import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '@/lib/apiMiddleware'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (req, admin) => {
    const { to } = await req.json()
    try {
      await sendEmail({
        to: to || admin.email,
        subject: 'MHStart — SMTP Test Email ✅',
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
            <div style="background: linear-gradient(135deg, #FF6B35, #D4A017); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">MHStart</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Maharashtra Startup Ecosystem</p>
            </div>
            <h2 style="color: #0A2463;">✅ SMTP is Working!</h2>
            <p style="color: #5A5048; line-height: 1.7;">
              This is a test email confirming your SMTP settings are configured correctly. 
              MHStart will now be able to send email notifications.
            </p>
            <p style="color: #9E9080; font-size: 13px; margin-top: 24px; border-top: 1px solid #E0DAD0; padding-top: 16px;">
              Sent from MHStart Admin Panel
            </p>
          </div>
        `,
      })
      return NextResponse.json({ success: true })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  })
}

import nodemailer from 'nodemailer'
import { supabaseAdmin } from './supabase'

async function getSmtpSettings() {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'smtp')
    .single()
  return data?.value || {}
}

export async function sendEmail({
  to, subject, html, text
}: {
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  const smtp = await getSmtpSettings()
  if (!smtp.host || !smtp.user) throw new Error('SMTP not configured')

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port || 587,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  })

  return transporter.sendMail({
    from: smtp.from || smtp.user,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  })
}

export function passwordResetEmail(name: string, resetUrl: string) {
  return {
    subject: 'MHStart Admin - Password Reset',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6B35;">MHStart Admin Password Reset</h2>
        <p>Hello ${name},</p>
        <p>Click the button below to reset your admin password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#FF6B35;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">Reset Password</a>
        <p style="color:#666;font-size:12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  }
}

export function newsSubmittedEmail(title: string, authorEmail: string) {
  return {
    subject: `New news submission: ${title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6B35;">New News Submission</h2>
        <p>A new article has been submitted for review:</p>
        <p><strong>${title}</strong></p>
        <p>Submitted by: ${authorEmail}</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/news" style="display:inline-block;background:#FF6B35;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">Review in Admin</a>
      </div>
    `
  }
}

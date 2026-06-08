import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'
const COOKIE_NAME = 'mhstart_admin_token'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { id: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
  } catch {
    return null
  }
}

export async function getAdminFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const tokenMatch = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!tokenMatch) return null
  return verifyToken(tokenMatch[1])
}

export function setAuthCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  }
}

export function clearAuthCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    maxAge: 0,
    path: '/'
  }
}

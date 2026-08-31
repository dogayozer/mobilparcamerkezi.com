import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super_secret_mpm_key_2026_jwt_token_auth'
)

export async function createSession(payload: { userId: string; email: string; name?: string | null }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET_KEY)

  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  store.set('mpm_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  })

  return token
}

export async function getSession() {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  const token = store.get('mpm_auth_token')?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as { userId: string; email: string; name?: string }
  } catch (error) {
    return null
  }
}

export async function clearSession() {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  store.delete('mpm_auth_token')
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  ADMIN_PASSWORD,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
} from '@/lib/adminSession'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    if (password === ADMIN_PASSWORD) {
      const cookieStore: any = cookies()
      const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
      store.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_SESSION_MAX_AGE,
        path: '/',
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Giriş hatası' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  store.delete(ADMIN_SESSION_COOKIE)
  return NextResponse.json({ success: true })
}

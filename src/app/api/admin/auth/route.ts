import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const correctPassword = process.env.ADMIN_PASSWORD || 'mpmadmin2026'

    if (password === correctPassword) {
      const cookieStore: any = cookies()
      const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
      store.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
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
  store.delete('admin_session')
  return NextResponse.json({ success: true })
}

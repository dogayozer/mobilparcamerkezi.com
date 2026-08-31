import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  const session = store.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const updated = await prisma.storeSettings.upsert({
      where: { id: 'mpm' },
      update: data,
      create: {
        id: 'mpm',
        ...data,
      },
    })
    return NextResponse.json({ success: true, settings: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ coupons })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const cookieStore: any = cookies()
  const store = cookieStore instanceof Promise ? await cookieStore : cookieStore
  const session = store.get('admin_session')
  if (session?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  try {
    const { code, type, value } = await req.json()
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
      },
    })
    return NextResponse.json({ success: true, coupon })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

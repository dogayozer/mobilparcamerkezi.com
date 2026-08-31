import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ valid: false, error: 'Kupon kodu girilmedi' }, { status: 400 })
  }

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, error: 'Kupon geçersiz' }, { status: 404 })
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    })
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'Sunucu hatası' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get('orderNumber')

  if (!orderNumber) {
    return NextResponse.json({ error: 'Sipariş numarası giriniz' }, { status: 400 })
  }

  try {
    const order = await prisma.order.findFirst({
      // Fodos ile ortak DB kullanıldığından, MPM'in kargo takip sayfasında
      // yanlışlıkla bir Fodos siparişi görüntülenmesin diye store filtresi eklendi.
      where: { orderNumber: orderNumber.trim(), store: 'mpm' },
      include: {
        items: {
          include: {
            product: { select: { title: true, slug: true } },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

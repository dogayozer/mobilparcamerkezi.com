import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayTRHash } from '@/lib/paytr'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const merchant_oid = formData.get('merchant_oid') as string
    const status = formData.get('status') as string
    const total_amount = formData.get('total_amount') as string
    const hash = formData.get('hash') as string
    const failed_reason_code = formData.get('failed_reason_code') as string
    const failed_reason_msg = formData.get('failed_reason_msg') as string
    const test_mode = formData.get('test_mode') as string | null
    const payment_type = formData.get('payment_type') as string | null

    if (!merchant_oid || !status || !hash) {
      return new Response('PAYTR notification failed: missing parameters', { status: 400 })
    }

    const isValid = verifyPayTRHash(merchant_oid, status, total_amount, hash)
    if (!isValid) {
      console.error('PAYTR Hash verification failed for order:', merchant_oid)
      return new Response('PAYTR notification failed: bad hash', { status: 400 })
    }

    if (status === 'success') {
      const amountTl = parseFloat(total_amount) / 100

      // PayTR mağaza test modundayken (veya canlıda test işleminde) bildirime test_mode=1 ekler;
      // bu durumda gerçek tahsilat yoktur: siparişi ONAYLAMA (faturalanıp kargolanmasın), nota işle.
      if (test_mode === '1') {
        const existing = await prisma.order.findUnique({
          where: { orderNumber: merchant_oid },
          select: { status: true, adminNote: true },
        })
        if (existing && existing.status === 'pending') {
          await prisma.order.update({
            where: { orderNumber: merchant_oid },
            data: {
              adminNote: [existing.adminNote, `PayTR TEST modunda işlem — gerçek tahsilat yok, sipariş onaylanmadı. Tutar: ${amountTl} TL`]
                .filter(Boolean)
                .join('\n'),
            },
          })
        }
        console.warn('PayTR TEST modu ödemesi, sipariş onaylanmadı:', merchant_oid)
        return new Response('OK', { status: 200 })
      }

      await prisma.order.update({
        where: { orderNumber: merchant_oid },
        data: {
          status: 'processing',
          adminNote: `PayTR Ödeme Başarılı. Tutar: ${amountTl} TL${payment_type ? ` (${payment_type})` : ''}`,
        },
      })
      // HepsiJET gönderisi ödeme sonrası otomatik açılmaz (Fodos'taki gibi): admin panelinden sipariş bazında açılır.
    } else {
      await prisma.order.update({
        where: { orderNumber: merchant_oid },
        data: {
          status: 'cancelled',
          adminNote: `PayTR Ödeme Başarısız: ${failed_reason_msg} (Kod: ${failed_reason_code})`,
        },
      })
    }

    // PayTR expects "OK" string response
    return new Response('OK', { status: 200 })
  } catch (error: any) {
    console.error('PayTR Callback Error:', error)
    return new Response('Internal error', { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayTRHash } from '@/lib/paytr'
import { sendHepsijetOrder } from '@/lib/hepsijet'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const merchant_oid = formData.get('merchant_oid') as string
    const status = formData.get('status') as string
    const total_amount = formData.get('total_amount') as string
    const hash = formData.get('hash') as string
    const failed_reason_code = formData.get('failed_reason_code') as string
    const failed_reason_msg = formData.get('failed_reason_msg') as string

    if (!merchant_oid || !status || !hash) {
      return new Response('PAYTR notification failed: missing parameters', { status: 400 })
    }

    const isValid = verifyPayTRHash(merchant_oid, status, total_amount, hash)
    if (!isValid) {
      console.error('PAYTR Hash verification failed for order:', merchant_oid)
      return new Response('PAYTR notification failed: bad hash', { status: 400 })
    }

    if (status === 'success') {
      await prisma.order.update({
        where: { orderNumber: merchant_oid },
        data: {
          status: 'processing',
          adminNote: `PayTR Ödeme Başarılı. Tutar: ${parseFloat(total_amount) / 100} TL`,
        },
      })

      // Ödeme onaylandığı an HepsiJET'e otomatik gönderi oluştur (STD). Bu adım asla
      // ödeme webhook'unun PayTR'a "OK" dönmesini engellememeli — hata olursa sadece
      // logla, sipariş "processing" kalır, admin panelinden manuel tekrar denenebilir.
      try {
        const fullOrder = await prisma.order.findUnique({
          where: { orderNumber: merchant_oid },
          include: { customer: true }
        })
        if (fullOrder && !fullOrder.trackingNumber) {
          const result = await sendHepsijetOrder({
            orderNumber: fullOrder.orderNumber,
            customerName: fullOrder.customer?.name || 'Misafir Müşteri',
            customerPhone: fullOrder.customer?.phone || '',
            customerEmail: fullOrder.customer?.email,
            shippingCity: fullOrder.shippingCity || '',
            shippingDistrict: fullOrder.shippingDistrict || '',
            shippingAddress: fullOrder.shippingAddress || '',
          })
          if (result.success) {
            await prisma.order.update({
              where: { orderNumber: merchant_oid },
              data: {
                trackingNumber: result.trackingNumber,
                shippingCompany: 'HepsiJET',
              }
            })
          } else {
            console.error('HepsiJET gönderi oluşturma hatası:', result.error)
          }
        }
      } catch (hepsijetError) {
        console.error('HepsiJET entegrasyon hatası:', hepsijetError)
      }
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

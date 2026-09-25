import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generatePayTRToken } from '@/lib/paytr'
import { getStoreSettings } from '@/lib/data'
import { withMpmPrice } from '@/lib/utils'
import { matchIl, matchIlce } from '@/lib/ilIlce'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { customer, items } = body

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: 'Geçersiz sipariş verisi' }, { status: 400 })
    }

    // E-fatura (BirFatura) geçerli bir il/ilçe istiyor; serbest metin kabul edilmez.
    const city = matchIl(customer.city)
    const district = matchIlce(city, customer.district)
    if (!city || !district) {
      return NextResponse.json({ error: 'Lütfen il ve ilçeyi listeden seçin' }, { status: 400 })
    }
    customer.city = city
    customer.district = district

    // GÜVENLİK: Tarayıcıdan gelen fiyat/tutar/kargo bilgisine güvenilmez — istek
    // değiştirilerek sipariş istenen fiyattan ödenebilirdi. Ürün fiyatları MPM fiyat
    // kuralıyla (withMpmPrice) veritabanından, kargo ücreti de mağaza ayarlarından
    // sunucuda yeniden hesaplanır.
    const productIds = items.map((it: any) => String(it.productId))
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        sale_price: true,
        reference_price: true,
        original_excel_price: true,
        mpm_sale_price: true,
        mpm_reference_price: true,
      },
    })
    const productsById = new Map(dbProducts.map((p) => [p.id, withMpmPrice(p)]))

    const orderItems: { productId: string; title: string; price: number; quantity: number }[] = []
    for (const it of items) {
      const product = productsById.get(String(it.productId))
      const quantity = Math.floor(Number(it.quantity))
      if (!product || !(quantity > 0)) {
        return NextResponse.json({ error: `Ürün bulunamadı: ${it.title || it.productId}` }, { status: 400 })
      }
      orderItems.push({ productId: product.id, title: product.title, price: product.sale_price, quantity })
    }

    const settings = await getStoreSettings()
    const itemsTotal = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0)
    const shippingThreshold = settings.shippingThreshold ?? 500
    const shippingFee = settings.shippingFee ?? 90
    const shippingCost = itemsTotal >= shippingThreshold ? 0 : shippingFee
    const totalAmount = itemsTotal + shippingCost

    // PayTR merchant_oid alfanumerik olmak zorunda, tire/özel karakter kabul etmiyor
    // (canlı testte "merchant_oid alfanumerik olmalidir" hatasıyla doğrulandı).
    const orderNumber = 'MPM' + Date.now().toString().slice(-9)

    // Check customer
    let dbCustomer = await prisma.customer.findUnique({
      where: { email: customer.email },
    })

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          email: customer.email,
          name: customer.name,
          phone: customer.phone,
          city: customer.city,
          district: customer.district,
          address: customer.address,
          isGuest: true,
        },
      })
    }

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: dbCustomer.id,
        totalAmount,
        shippingCost,
        shippingCity: customer.city,
        shippingDistrict: customer.district,
        shippingAddress: customer.address,
        adminNote: customer.notes || null,
        status: 'pending',
        store: 'mpm',
        items: {
          create: orderItems.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            price: it.price,
          })),
        },
      },
    })

    // If PayTR is configured, generate iframe token
    const merchant_id = process.env.PAYTR_MERCHANT_ID
    const merchant_key = process.env.PAYTR_MERCHANT_KEY
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT

    if (merchant_id && merchant_key && merchant_salt) {
      const user_basket: Array<[string, string, number]> = orderItems.map((it) => [
        it.title.substring(0, 50),
        it.price.toString(),
        it.quantity,
      ])

      const host = req.headers.get('host') || 'localhost:3000'
      const protocol = host.includes('localhost') ? 'http' : 'https'

      const paymentParams = generatePayTRToken({
        email: customer.email,
        payment_amount: Math.round(totalAmount * 100),
        merchant_oid: orderNumber,
        user_name: customer.name,
        user_address: customer.address,
        user_phone: customer.phone,
        merchant_ok_url: `${protocol}://${host}/odeme/basarili?orderNumber=${orderNumber}`,
        merchant_fail_url: `${protocol}://${host}/odeme/basarisiz?orderNumber=${orderNumber}`,
        user_basket,
        user_ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
      })

      // Request PayTR iFrame token from PayTR endpoint
      const formData = new URLSearchParams()
      Object.entries(paymentParams).forEach(([k, v]) => formData.append(k, String(v)))

      const paytrRes = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      const paytrData = await paytrRes.json()
      if (paytrData.status === 'success') {
        return NextResponse.json({
          iframe_token: paytrData.token,
          orderNumber,
        })
      } else {
        console.error('PayTR Error:', paytrData.reason)
        return NextResponse.json({
          error: paytrData.reason || 'PayTR ödeme başlatılamadı.',
          orderNumber,
        })
      }
    }

    // If PayTR is not yet set up (empty parameters), return direct order success for testing
    return NextResponse.json({
      success: true,
      orderNumber,
      message: 'Siparişiniz test modunda kaydedildi.',
    })
  } catch (error: any) {
    console.error('Checkout API Error:', error)
    return NextResponse.json({ error: error.message || 'Ödeme işlemi başarısız' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { withMpmPrice } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // First search in local products to find relevant matches
    const searchTerms = message
      .toLowerCase()
      .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ\s]/g, '')
      .split(' ')
      .filter((t: string) => t.length > 1)

    let matchingProducts: any[] = []
    if (searchTerms.length > 0) {
      matchingProducts = (
        await prisma.product.findMany({
          where: {
            status: { not: 'inactive' },
            OR: [
              ...searchTerms.map((term: string) => ({
                title: { contains: term, mode: 'insensitive' as const },
              })),
              ...searchTerms.map((term: string) => ({
                description_raw: { contains: term, mode: 'insensitive' as const },
              })),
            ],
          },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            sale_price: true,
            reference_price: true,
            mpm_sale_price: true,
            mpm_reference_price: true,
            original_excel_price: true,
            brand: true,
            stock_qty: true,
          },
        })
      ).map(withMpmPrice)
    }

    // Try Google Gemini if API key is provided
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    let aiReply = ''

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const productContext = matchingProducts
          .map((p) => `- ${p.title} (${p.sale_price} TL, Stok: ${p.stock_qty})`)
          .join('\n')

        const prompt = `Sen "Mobil Parça Merkezi" e-ticaret sitesinin profesyonel, samimi ve teknik uzman müşteri asistanısın. 
Müşteri sorusu: "${message}"

Veritabanımızdaki eşleşen ilgili ürünler:
${productContext || 'Özel bir ürün eşleşmesi bulunamadı.'}

Kurallar:
- Müşteriye net, yardımcı ve kibar cevap ver.
- Telefon yedek parçaları (batarya, ekran, kasa, flex, şarj aleti vb.) konusunda uzman olduğunu hissettir.
- 16:30'a kadar verilen siparişlerin AYNI GÜN KARGOYA verildiğini, 500 TL üzeri kargonun ücretsiz olduğunu hatırlatabilirsin.
- Yanıtı çok uzatmadan, öz ve anlaşılır tut.`

        const result = await model.generateContent(prompt)
        aiReply = result.response.text()
      } catch (aiErr) {
        console.error('Gemini API Error:', aiErr)
      }
    }

    if (!aiReply) {
      if (matchingProducts.length > 0) {
        aiReply = `Aradığınız "${message}" için veritabanımızda ${matchingProducts.length} adet uygun parça buldum. Aşağıdaki listeden inceleyebilirsiniz:`
      } else {
        aiReply = `Aradığınız kriterlere uygun ürün bulamadık. Lütfen farklı bir model veya parça ismi belirterek tekrar arayın veya doğrudan arama çubuğunu kullanın.`
      }
    }

    return NextResponse.json({
      reply: aiReply,
      products: matchingProducts,
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

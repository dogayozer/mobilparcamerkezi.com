import { NextResponse } from 'next/server'
import { generateText, tool, stepCountIs } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withMpmPrice } from '@/lib/utils'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: 'Akıllı asistan şu an yapılandırılmamış. Lütfen arama çubuğunu kullanın.',
        products: [],
      })
    }

    let foundProducts: any[] = []

    const result = await generateText({
      model: google('gemini-3.6-flash'),
      maxRetries: 2,
      maxOutputTokens: 350,
      // Araç çağrısından sonra modelin sonucu yorumlayıp gerçek bir metin cevabı
      // üretmesi için birden fazla adıma izin veriyoruz.
      stopWhen: stepCountIs(3),
      // "Thinking" (uzun düşünme) bütçesi minimuma çekildi — bu model tamamen kapatmayı
      // reddediyor (400 hatası), ama düşük bütçe yanıt süresini 30-40sn'den ~5-10sn'ye indiriyor.
      providerOptions: { google: { thinkingConfig: { thinkingBudget: 128 } } },
      messages: [{ role: 'user', content: message }],
      system: `Sen "Mobil Parça Merkezi" e-ticaret sitesinin profesyonel, samimi ve teknik uzman müşteri asistanısın.
Görevlerin:
1. Müşterilere çok kibar, samimi ve KISA cevaplar ver.
2. Müşteri bir ürün/parça/model aradığında KESİNLİKLE 'searchProducts' aracını kullanarak veritabanından ürünü sorgula.
3. Müşteri kelimeleri yanlış/eksik yazmış olsa bile (örn: "kilif" -> "kılıf", "sarj" -> "şarj", "ekrn" -> "ekran") sen bunları DÜZELTEREK ve en yalın haline getirerek arama yap.
4. Veritabanından gelen sonuçları müşteriye sun: ürün adı, fiyat (TL).
5. Asla stokta olmayan veya veritabanından dönmeyen bir ürünü varmış gibi uydurma.
6. Uygun olduğunda 16:30'a kadar verilen siparişlerin AYNI GÜN KARGOYA verildiğini, 500 TL üzeri kargonun ücretsiz olduğunu hatırlatabilirsin.
7. Telefon yedek parçaları (batarya, ekran, kasa, flex, şarj aleti vb.) konusunda uzman olduğunu hissettir.`,
      tools: {
        searchProducts: tool({
          description:
            'Müşteri bir ürün aradığında veritabanında arama yapmak için kullanılır. Yazım hatalarını düzelterek ve en yalın anahtar kelimeleri kullanarak ara.',
          parameters: z.object({
            keywords: z
              .array(z.string())
              .describe('Aranacak düzeltilmiş anahtar kelimeler listesi (örn: ["iphone", "11", "batarya"])'),
          }),
          // @ts-ignore
          execute: async (args: any) => {
            // Model bazen şemayı görmezden gelip farklı bir anahtar adıyla (örn. "query")
            // ya da dizi yerine tek bir metinle çağırabiliyor — her ihtimale karşı normalize et.
            const raw = args.keywords ?? args.query ?? args.query_keywords ?? args.keyword ?? null
            let keywords: string[] = []
            if (Array.isArray(raw)) {
              keywords = raw.filter((k: any) => typeof k === 'string' && k.trim())
            } else if (typeof raw === 'string' && raw.trim()) {
              keywords = raw.trim().split(/\s+/).filter(Boolean)
            } else if (raw == null && Object.keys(args).length > 0) {
              const val = Object.values(args)[0]
              if (Array.isArray(val)) keywords = (val as any[]).filter((k) => typeof k === 'string')
              else if (typeof val === 'string') keywords = val.trim().split(/\s+/).filter(Boolean)
            }

            if (keywords.length === 0) {
              return { success: false, message: 'Anahtar kelime bulunamadı.' }
            }

            const andConditions = keywords.map((keyword: string) => ({
              OR: [
                { title: { contains: keyword, mode: 'insensitive' as const } },
                { brand: { contains: keyword, mode: 'insensitive' as const } },
                { compatible_models: { contains: keyword, mode: 'insensitive' as const } },
              ],
            }))

            const products = await prisma.product.findMany({
              where: { status: { not: 'inactive' }, AND: andConditions },
              select: {
                id: true,
                title: true,
                slug: true,
                sale_price: true,
                reference_price: true,
                mpm_sale_price: true,
                mpm_reference_price: true,
                original_excel_price: true,
                stock_qty: true,
              },
              orderBy: [{ has_real_photo: 'desc' }, { stock_qty: 'desc' }],
              take: 5,
            })

            const mapped = products.map(withMpmPrice)
            foundProducts = mapped

            if (mapped.length === 0) {
              return { success: false, message: 'Aranan kriterlere uygun ürün bulunamadı.' }
            }
            return { success: true, products: mapped }
          },
        }),
      },
    })

    return NextResponse.json({
      reply: result.text || 'Size nasıl yardımcı olabilirim?',
      products: foundProducts,
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

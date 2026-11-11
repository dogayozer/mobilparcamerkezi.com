import { PRICE_ON_REQUEST_SLUGS } from '@/lib/priceOnRequest'
import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { withMpmPrice, mpmizeText, getCategoryIntro } from '@/lib/utils'

export const dynamic = 'force-dynamic'

// Her istekte 2000 ürünü tüm sütunlarıyla çekmek Neon compute/ağ maliyeti yaratıyordu.
// Sadece feed'in kullandığı alanlar, veri önbelleği öğe sınırı (~2 MB) altında kalan parçalar halinde saatte bir yenilenir.
const CHUNK_SIZE = 500
const CHUNK_COUNT = 4
const where = {
  status: 'active',
  stock_qty: { gt: 0 },
  NOT: { category: { slug: { in: PRICE_ON_REQUEST_SLUGS } } },
}

const getChunk = unstable_cache(
  (index: number) =>
    prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
      skip: index * CHUNK_SIZE,
      take: CHUNK_SIZE,
      select: {
        slug: true,
        title: true,
        brand: true,
        barcode: true,
        sale_price: true,
        mpm_sale_price: true,
        original_excel_price: true,
        description_raw: true,
        images: { select: { url: true }, orderBy: { order: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
    }),
  ['mpm-feed-products-chunk'],
  { revalidate: 3600 }
)

export async function GET() {
  try {
    // Sırayla: paralel istek Prisma bağlantı havuzunu tüketip zaman aşımına düşüyor
    const products = []
    for (let i = 0; i < CHUNK_COUNT; i++) products.push(...(await getChunk(i)))

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Mobil Parça Merkezi</title>
<link>${baseUrl}</link>
<description>Telefon Yedek Parça ve Aksesuar Merkezi</description>
`

    for (const rawP of products) {
      const p = withMpmPrice(rawP)
      const imgUrl = p.images[0]?.url || `${baseUrl}/placeholder.png`
      const catName = p.category?.name || 'Telefon Parçaları'
      const categoryIntro = getCategoryIntro(p.category?.slug, p.brand)
      const feedDescription = (categoryIntro + ' ' + (mpmizeText(p.description_raw) || p.title)).trim()

      xml += `  <item>
    <g:id>${p.barcode}</g:id>
    <g:title><![CDATA[${p.title}]]></g:title>
    <g:description><![CDATA[${feedDescription}]]></g:description>
    <g:link>${baseUrl}/urun/${p.slug}</g:link>
    <g:image_link>${imgUrl}</g:image_link>
    <g:brand><![CDATA[${p.brand || 'Mobil Parça Merkezi'}]]></g:brand>
    <g:condition>new</g:condition>
    <g:availability>in stock</g:availability>
    <g:price>${p.sale_price.toFixed(2)} TRY</g:price>
    <g:product_type><![CDATA[${catName}]]></g:product_type>
  </item>\n`
    }

    xml += `</channel>
</rss>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error: any) {
    console.error('Google Shopping feed error:', error)
    return new Response('Error generating feed', { status: 500 })
  }
}

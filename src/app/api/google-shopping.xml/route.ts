import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withMpmPrice, mpmizeText } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'active',
        stock_qty: { gt: 0 },
      },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        category: true,
      },
      take: 2000,
    })

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

      xml += `  <item>
    <g:id>${p.barcode}</g:id>
    <g:title><![CDATA[${p.title}]]></g:title>
    <g:description><![CDATA[${mpmizeText(p.description_raw) || p.title}]]></g:description>
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

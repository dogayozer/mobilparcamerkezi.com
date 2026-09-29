import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { withMpmPrice } from '@/lib/utils'
import { CAMPAIGN, discountPercent, type CampaignProduct } from '@/lib/campaignConfig'

export { CAMPAIGN, discountPercent }
export type { CampaignProduct }

// ~420 ürün (~150 KB): her istekte DB'ye gitmesin diye 5 dakikalık veri önbelleği.
// withMpmPrice: MPM fiyatını uygular, iç alanları (alış fiyatı vb.) ayıklar.
export const getCampaignProducts = unstable_cache(
  async (): Promise<CampaignProduct[]> => {
    const rows = await prisma.product.findMany({
      where: { campaign: CAMPAIGN.key, status: 'active', stock_qty: { gt: 0 } },
      select: {
        id: true,
        slug: true,
        title: true,
        brand: true,
        barcode: true,
        status: true,
        stock_qty: true,
        campaign: true,
        sale_price: true,
        reference_price: true,
        mpm_sale_price: true,
        mpm_reference_price: true,
        original_excel_price: true,
        images: { select: { url: true }, orderBy: { order: 'asc' }, take: 1 },
      },
      orderBy: { id: 'asc' },
    })
    return rows.map(withMpmPrice)
  },
  ['mpm-campaign-products', CAMPAIGN.key],
  { revalidate: 300 }
)

// Açılış pop-up'ı için vitrin: en yüksek indirimli, birbirinden farklı fiyatlı 6 ürün.
export const getCampaignShowcase = unstable_cache(
  async (): Promise<{ items: CampaignProduct[]; maxDiscount: number; total: number }> => {
    const all = await getCampaignProducts()
    const ranked = all
      .filter((p) => discountPercent(p) > 0 && p.images.length > 0 && p.sale_price >= 100)
      .sort((a, b) => discountPercent(b) - discountPercent(a) || a.sale_price - b.sale_price)
    const seen = new Set<number>()
    const items: CampaignProduct[] = []
    for (const p of ranked) {
      if (seen.has(p.sale_price)) continue
      seen.add(p.sale_price)
      items.push(p)
      if (items.length === 6) break
    }
    return { items, maxDiscount: Math.max(0, ...all.map(discountPercent)), total: all.length }
  },
  ['mpm-campaign-showcase', CAMPAIGN.key],
  { revalidate: 300 }
)

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { CAMPAIGN, discountPercent, getCampaignProducts } from '@/lib/campaign'

const PAGE_SIZE = 24
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

const SORTS = {
  indirim: { label: 'En Yüksek İndirim', fn: (a: any, b: any) => discountPercent(b) - discountPercent(a) || a.sale_price - b.sale_price },
  'fiyat-artan': { label: 'Fiyat: Düşükten Yükseğe', fn: (a: any, b: any) => a.sale_price - b.sale_price },
  'fiyat-azalan': { label: 'Fiyat: Yüksekten Düşüğe', fn: (a: any, b: any) => b.sale_price - a.sale_price },
} as const
type SortKey = keyof typeof SORTS

export const metadata: Metadata = {
  title: 'Adaptör Kampanyası | Kampanyalı Hızlı Şarj Adaptörleri | Mobil Parça Merkezi',
  description: 'Mobil Parça Merkezi Adaptör Kampanyası: Type-C hızlı şarj adaptörleri ve şarj kabloları kampanyalı fiyatlarla, aynı gün kargo.',
  alternates: { canonical: `${SITE_URL}/kampanya/adaptor` },
}

export default async function AdaptorKampanyasiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  if (!CAMPAIGN.active) notFound()

  const sp = await searchParams
  const sirala: SortKey = typeof sp.sirala === 'string' && sp.sirala in SORTS ? (sp.sirala as SortKey) : 'indirim'

  const all = await getCampaignProducts()
  const sorted = [...all].sort(SORTS[sirala].fn)
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const requested = parseInt(typeof sp.sayfa === 'string' ? sp.sayfa : '1', 10)
  const sayfa = Math.min(totalPages, Math.max(1, Number.isFinite(requested) ? requested : 1))
  const items = sorted.slice((sayfa - 1) * PAGE_SIZE, sayfa * PAGE_SIZE)
  const maxDiscount = Math.max(0, ...all.map(discountPercent))

  const href = (page: number, sort: SortKey) => {
    const q = new URLSearchParams()
    if (sort !== 'indirim') q.set('sirala', sort)
    if (page > 1) q.set('sayfa', String(page))
    const s = q.toString()
    return `${CAMPAIGN.path}${s ? `?${s}` : ''}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-ink text-white border-[3px] border-ink rounded-md overflow-hidden mb-6">
        <div className="hazard-stripe" />
        <div className="px-6 sm:px-10 py-8">
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-500 mb-2">Kampanya</span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold uppercase leading-tight">Adaptör Kampanyası</h1>
          <p className="mt-2 text-sm sm:text-base text-[#cfc7b6]">
            {all.length} ürün kampanyalı fiyatlarla{maxDiscount > 0 ? <> — <strong className="text-yellow-500">%{maxDiscount}</strong>'e varan indirim</> : null}.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className="text-xs font-mono text-ink-soft">{all.length} KAMPANYALI ÜRÜN</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SORTS) as SortKey[]).map((key) => (
            <Link
              key={key}
              href={href(1, key)}
              className={`px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-display font-bold uppercase border transition ${
                sirala === key ? 'bg-ink text-yellow-500 border-ink' : 'bg-white text-ink border-ink/20 hover:border-ink'
              }`}
            >
              {SORTS[key].label}
            </Link>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-ink-soft py-16">Kampanyalı ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-2 mt-10" aria-label="Sayfalar">
          {sayfa > 1 && (
            <Link href={href(sayfa - 1, sirala)} className="px-3 py-1.5 rounded-md border border-ink/20 text-xs font-bold hover:border-ink">Önceki</Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={href(n, sirala)}
              aria-current={n === sayfa ? 'page' : undefined}
              className={`w-9 h-9 flex items-center justify-center rounded-md border text-xs font-mono font-bold ${
                n === sayfa ? 'bg-ink text-yellow-500 border-ink' : 'border-ink/20 hover:border-ink'
              }`}
            >
              {n}
            </Link>
          ))}
          {sayfa < totalPages && (
            <Link href={href(sayfa + 1, sirala)} className="px-3 py-1.5 rounded-md border border-ink/20 text-xs font-bold hover:border-ink">Sonraki</Link>
          )}
        </nav>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { CAMPAIGN, discountPercent, type CampaignProduct } from '@/lib/campaignConfig'
import { formatPrice } from '@/lib/utils'

export const CAMPAIGN_SPLASH_KEY = 'campaignSplash'
const DISMISS_HOURS = 24
// Alışveriş/ödeme ve üyelik akışını bölmemek (ve kampanya sayfasında tekrar etmemek) için gösterilmez
const HIDDEN_PREFIXES = ['/admin', '/odeme', '/sepet', '/kayit-ol', '/giris', '/bayi', CAMPAIGN.path]

export default function CampaignSplash({ items, maxDiscount, total }: { items: CampaignProduct[]; maxDiscount: number; total: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hidden = HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  useEffect(() => {
    if (hidden) return
    try {
      const saved = JSON.parse(localStorage.getItem(CAMPAIGN_SPLASH_KEY) || 'null')
      if (saved?.at && Date.now() - saved.at < DISMISS_HOURS * 60 * 60 * 1000) return
    } catch {}
    const timer = setTimeout(() => setOpen(true), 1500)
    return () => clearTimeout(timer)
  }, [hidden])

  const close = () => {
    try { localStorage.setItem(CAMPAIGN_SPLASH_KEY, JSON.stringify({ at: Date.now() })) } catch {}
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!open || hidden || items.length === 0) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 bg-ink/70 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-splash-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-paper border-[3px] border-ink rounded-md shadow-2xl"
      >
        <div className="bg-ink text-white px-6 pt-6 pb-5">
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute top-3 right-3 p-1.5 rounded-md text-[#8a8272] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-500 mb-1">Kampanya Başladı</span>
          <h2 id="campaign-splash-title" className="text-2xl sm:text-3xl font-display font-extrabold uppercase pr-8 leading-tight">{CAMPAIGN.name}</h2>
          <p className="text-sm text-[#cfc7b6] mt-1">
            {total} adaptör ve şarj ürününde{maxDiscount > 0 ? <> <strong className="text-yellow-500">%{maxDiscount}</strong>'e varan indirim</> : ' kampanyalı fiyatlar'}.
          </p>
        </div>
        <div className="hazard-stripe" />

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {items.map((p) => {
              const pct = discountPercent(p)
              return (
                <Link
                  key={p.id}
                  href={`/urun/${p.slug}`}
                  onClick={close}
                  className="group relative bg-white border border-ink/15 hover:border-ink rounded-md overflow-hidden transition-colors"
                >
                  {pct > 0 && (
                    <span className="absolute top-1.5 left-1.5 z-10 bg-yellow-500 text-ink text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm">%{pct}</span>
                  )}
                  <div className="relative pt-[100%] bg-paper-2">
                    <Image src={p.images[0].url} alt={p.title} fill sizes="(max-width: 640px) 45vw, 200px" className="object-contain p-2" />
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] leading-tight text-ink font-semibold line-clamp-2 min-h-[2.2em]">{p.title}</div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-sm font-display font-extrabold text-ink">{formatPrice(p.sale_price)}</span>
                      {p.reference_price ? <span className="text-[10px] font-mono text-ink-soft line-through">{formatPrice(p.reference_price)}</span> : null}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-5">
            <button
              type="button"
              onClick={close}
              className="py-3 bg-paper-2 border border-ink/15 text-ink rounded-md text-sm font-display font-bold uppercase hover:bg-white transition order-2 sm:order-1"
            >
              Daha Sonra
            </button>
            <Link
              href={CAMPAIGN.path}
              onClick={close}
              className="sm:col-span-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-ink text-center rounded-md text-sm font-display font-extrabold uppercase transition order-1 sm:order-2"
            >
              Kampanyalı Adaptörlere Git →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

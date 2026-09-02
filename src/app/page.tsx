import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getFeaturedBrands, getCategoryTree } from '@/lib/data'
import { withMpmPrice } from '@/lib/utils'
import HeroBanner from '@/components/HeroBanner'
import ProductCard from '@/components/ProductCard'
import {
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Smartphone
} from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  let featuredProducts: any[] = []
  let latestProducts: any[] = []
  let categories: any[] = []
  let brands: string[] = []
  let activeProductCount = 0

  try {
    const [fetchedCategories, fetchedBrands, count] = await Promise.all([
      getCategoryTree(),
      getFeaturedBrands(),
      prisma.product.count({ where: { status: { not: 'inactive' } } }),
    ])
    categories = fetchedCategories
    brands = fetchedBrands
    activeProductCount = count

    featuredProducts = (
      await prisma.product.findMany({
        where: { status: { not: 'inactive' } },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { stock_qty: 'desc' },
        take: 8,
      })
    ).map(withMpmPrice)

    latestProducts = (
      await prisma.product.findMany({
        where: { status: { not: 'inactive' } },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 8,
      })
    ).map(withMpmPrice)
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }

  const skuLabel = activeProductCount > 0 ? `${activeProductCount.toLocaleString('tr-TR')}+` : '6.000+'

  return (
    <div>
      {/* Hero Banner with Quick Device Finder */}
      <HeroBanner brands={brands} categories={categories} />

      <div className="space-y-12 sm:space-y-16 pt-12 sm:pt-16">
        {/* Featured / Best Sellers Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b-[3px] border-ink pb-4">
            <div>
              <div className="flex items-center gap-2 text-yellow-800 font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>// Çok Satanlar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-ink tracking-tight">
                Öne Çıkan Yedek Parçalar
              </h2>
            </div>
            <Link
              href="/kategori/batarya"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-ink hover:text-yellow-800 border border-ink/20 px-4 py-2 rounded-md transition"
            >
              <span>TÜMÜNÜ GÖR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-md border border-ink/15 p-8">
              <Smartphone className="w-12 h-12 text-ink/20 mx-auto mb-3" />
              <h3 className="text-base font-bold text-ink">Ürünler Yükleniyor</h3>
              <p className="text-xs text-ink-soft max-w-sm mx-auto mt-1">
                Veritabanı hazır olduğunda veya Excel'den ürünler aktarıldığında burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Category Highlight Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-ink rounded-md p-8 sm:p-12 text-white relative overflow-hidden border border-yellow-500/20">
            <div className="absolute inset-0 grid-tex opacity-40" />
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/40 text-yellow-500 text-[11px] font-mono font-bold px-3 py-1 rounded-md uppercase">
                <Zap className="w-3.5 h-3.5" />
                Yüksek Kapasite & Güvenlik
              </span>
              <h3 className="text-2xl sm:text-4xl font-display font-extrabold uppercase tracking-tight leading-tight">
                Telefonunuzun Şarjı Çabuk mu Bitiyor?
              </h3>
              <p className="text-xs sm:text-sm text-[#b8b0a0] leading-relaxed font-normal">
                Orijinal çipli, aşırı ısınma ve kısa devre korumalı A+ kalite bataryalarımızla telefonunuzun pil ömrünü ilk günkü seviyesine taşıyın.
              </p>
              <div className="pt-2">
                <Link
                  href="/kategori/batarya"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-ink text-xs font-display font-bold uppercase rounded-md transition"
                >
                  <span>Batarya Modellerini İncele</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Added Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b-[3px] border-ink pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 font-mono font-bold text-[11px] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>// Yeni Stoklar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-ink tracking-tight">
                Yeni Eklenen Ürünler
              </h2>
            </div>
            <Link
              href="/kategori/telefon-kasasi"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-ink hover:text-emerald-700 border border-ink/20 px-4 py-2 rounded-md transition"
            >
              <span>TÜM YENİ ÜRÜNLER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestProducts.length === 0 ? null : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Real stats trust strip */}
        <section className="bg-ink py-9">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4">
            {[
              [skuLabel, 'Aktif SKU'],
              ['%100', 'Test Edilmiş Parça'],
              ['16:30', 'Kargo Kesim Saati'],
              ['14 Gün', 'Koşulsuz İade'],
            ].map(([num, lbl], i) => (
              <div key={lbl} className={`px-4 md:px-6 ${i !== 0 ? 'border-l border-yellow-500/15' : ''}`}>
                <div className="text-2xl font-display font-extrabold text-yellow-500">{num}</div>
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-[#b8b0a0] mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Mobil Parça Merkezi? */}
        <section className="bg-white border-y border-ink/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-yellow-800">
                Güven & Kalite Standardı
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold uppercase text-ink mt-1">
                Neden Mobil Parça Merkezi?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-md bg-paper border border-ink/10 hover:border-yellow-500 transition-all text-center space-y-3">
                <div className="w-14 h-14 rounded-md bg-ink text-yellow-500 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-ink">%100 Test Edilmiş Parçalar</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Her bir ürün kargolanmadan önce uzman teknisyenlerimiz tarafından kalite kontrol testlerinden geçirilir.
                </p>
              </div>

              <div className="p-6 rounded-md bg-paper border border-ink/10 hover:border-yellow-500 transition-all text-center space-y-3">
                <div className="w-14 h-14 rounded-md bg-yellow-500 text-ink flex items-center justify-center mx-auto">
                  <Truck className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-ink">Jet Hızında Aynı Gün Kargo</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Hafta içi 16:30'a kadar verilen siparişleriniz aynı gün özenle paketlenerek anlaşmalı kargoya verilir.
                </p>
              </div>

              <div className="p-6 rounded-md bg-paper border border-ink/10 hover:border-emerald-500 transition-all text-center space-y-3">
                <div className="w-14 h-14 rounded-md bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-ink">Birebir Değişim & Destek</h4>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Uyumsuzluk veya parça sorularınız için WhatsApp canlı teknik hattımız her an yanınızda.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

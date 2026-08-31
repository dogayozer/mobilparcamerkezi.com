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
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  BatteryCharging,
  Smartphone,
  Wrench
} from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  let featuredProducts: any[] = []
  let latestProducts: any[] = []
  let categories: any[] = []
  let brands: string[] = []

  try {
    const [fetchedCategories, fetchedBrands] = await Promise.all([
      getCategoryTree(),
      getFeaturedBrands(),
    ])
    categories = fetchedCategories
    brands = fetchedBrands

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

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Banner with Quick Device Finder */}
      <HeroBanner brands={brands} categories={categories} />

      {/* Featured / Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-red-600 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>POPÜLER VE ÇOK SATANLAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Öne Çıkan Yedek Parçalar
            </h2>
          </div>
          <Link
            href="/kategori/batarya"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-navy-700 hover:text-brand-navy-800 bg-brand-navy-50 px-4 py-2 rounded-xl transition"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Ürünler Yükleniyor</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Veritabanı hazır olduğunda veya Excel'den ürünler aktarıldığında burada listelenecektir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Modern Category Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-brand-navy-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-brand-red-500/15 border border-brand-red-400/30 text-brand-red-300 text-xs font-bold px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5" />
              YÜKSEK KAPASİTE & GÜVENLİK
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Telefonunuzun Şarjı Çabuk mu Bitiyor?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Orijinal çipli, aşırı ısınma ve kısa devre korumalı A+ kalite bataryalarımızla telefonunuzun pil ömrünü ilk günkü seviyesine taşıyın.
            </p>
            <div className="pt-2">
              <Link
                href="/kategori/batarya"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red-500 hover:bg-brand-red-400 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-brand-red-500/30"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>YENİ STOKLAR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Yeni Eklenen Ürünler
            </h2>
          </div>
          <Link
            href="/kategori/kasa"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl transition"
          >
            <span>Tüm Yeni Ürünler</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {latestProducts.length === 0 ? null : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Mobil Parça Merkezi? */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-navy-700">
              GÜVEN & KALİTE STANDARDI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Neden Mobil Parça Merkezi?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-brand-navy-300 transition-all text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-navy-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-navy-600/20">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">%100 Test Edilmiş Parçalar</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Her bir ürün kargolanmadan önce uzman teknisyenlerimiz tarafından kalite kontrol testlerinden geçirilir.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-brand-red-300 transition-all text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-red-500/20">
                <Truck className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Jet Hızında Aynı Gün Kargo</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hafta içi 16:30'a kadar verilen siparişleriniz aynı gün özenle paketlenerek anlaşmalı kargoya verilir.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Birebir Değişim & Destek</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Uyumsuzluk veya parça sorularınız için WhatsApp canlı teknik hattımız her an yanınızda.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

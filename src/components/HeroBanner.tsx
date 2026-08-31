'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Zap,
  ShieldCheck,
  Truck,
  Sparkles,
  Smartphone,
  BatteryCharging,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react'

interface HeroBannerProps {
  brands?: string[]
  categories?: Array<{ id: string; name: string; slug: string }>
}

export default function HeroBanner({ brands = [], categories = [] }: HeroBannerProps) {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deviceModel, setDeviceModel] = useState('')

  const handleFinderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let query = ''
    if (selectedBrand) query += selectedBrand + ' '
    if (deviceModel) query += deviceModel + ' '
    if (selectedCategory) query += selectedCategory + ' '

    if (query.trim()) {
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const popularBrands = [
    { name: 'Apple iPhone', slug: 'apple', color: 'from-brand-navy-950 to-brand-navy-900' },
    { name: 'Samsung', slug: 'samsung', color: 'from-brand-navy-900 to-brand-navy-800' },
    { name: 'Xiaomi & Redmi', slug: 'xiaomi', color: 'from-orange-950 to-amber-900' },
    { name: 'Huawei', slug: 'huawei', color: 'from-brand-red-950 to-brand-red-900' },
    { name: 'Oppo & Realme', slug: 'oppo', color: 'from-emerald-950 to-teal-900' },
    { name: 'Nokia / Tuşlu', slug: 'nokia', color: 'from-brand-navy-900 to-brand-navy-800' },
  ]

  return (
    <div className="relative overflow-hidden bg-brand-navy-950 text-white py-12 lg:py-16">
      {/* Background Tech Mesh & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c3864_1px,transparent_1px),linear-gradient(to_bottom,#0c3864_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-brand-navy-600/25 via-brand-red-600/15 to-brand-navy-400/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Quick Device Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red-500/10 border border-brand-red-500/30 text-brand-red-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-red-400 animate-pulse" />
              <span>SİRKECİ'DEN TÜRKİYE'YE TOPTAN YEDEK PARÇA</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Cihazınız İçin <br />
              <span className="bg-gradient-to-r from-brand-navy-300 via-brand-navy-200 to-brand-red-300 bg-clip-text text-transparent">
                %100 Uyumlu & Test Edilmiş
              </span>{' '}
              Yedek Parçalar
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
              Telefon bataryası, kasa, kapak, şarj soketi, tuş takımı ve koruyucu camlarda en yüksek kalite standardı. Saat 16:30'a kadar aynı gün kargo avantajıyla.
            </p>

            {/* Smart Device Finder Widget */}
            <div className="p-4 sm:p-5 rounded-2xl bg-brand-navy-900/80 border border-brand-navy-800 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-200">
                <Cpu className="w-4 h-4 text-brand-red-400" />
                <span>HIZLI MODEL & PARÇA BULUCU</span>
              </div>

              <form onSubmit={handleFinderSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    1. Marka
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-brand-navy-950 border border-brand-navy-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-red-500"
                  >
                    <option value="">Tüm Markalar</option>
                    <option value="Apple">Apple iPhone</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi / Redmi</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Nokia">Nokia</option>
                    <option value="General Mobile">General Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    2. Cihaz Modeli
                  </label>
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="Örn: iPhone 11, Note 8"
                    className="w-full bg-brand-navy-950 border border-brand-navy-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-red-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-brand-red-600 to-brand-red-500 hover:from-brand-red-500 hover:to-brand-red-400 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-brand-red-600/30 transition duration-200"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Parçaları Bul</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Featured Quick Categories Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <Link
              href="/kategori/batarya"
              className="group p-4 rounded-2xl bg-gradient-to-br from-brand-navy-900 to-brand-navy-800 border border-brand-navy-800 hover:border-brand-red-500/50 hover:shadow-xl hover:shadow-brand-red-500/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-brand-red-300 transition">
                Bataryalar
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Yüksek kapasiteli, orijinal korumalı piller</p>
            </Link>

            <Link
              href="/kategori/kasa"
              className="group p-4 rounded-2xl bg-gradient-to-br from-brand-navy-900 to-brand-navy-800 border border-brand-navy-800 hover:border-brand-red-500/50 hover:shadow-xl hover:shadow-brand-red-500/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-navy-500/10 text-brand-navy-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-brand-red-300 transition">
                Kasa & Kapaklar
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Birebir oturan tam uyumlu arka gövde</p>
            </Link>

            <Link
              href="/kategori/sarj-aleti"
              className="group p-4 rounded-2xl bg-gradient-to-br from-brand-navy-900 to-brand-navy-800 border border-brand-navy-800 hover:border-brand-red-500/50 hover:shadow-xl hover:shadow-brand-red-500/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-brand-red-300 transition">
                Şarj & Kablolar
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Hızlı şarj destekli adaptör ve kablolar</p>
            </Link>

            <Link
              href="/kategori/tus-takimi"
              className="group p-4 rounded-2xl bg-gradient-to-br from-brand-navy-900 to-brand-navy-800 border border-brand-navy-800 hover:border-brand-red-500/50 hover:shadow-xl hover:shadow-brand-red-500/10 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-brand-red-300 transition">
                Tuş Takımı & Flex
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Tüm klasik ve yeni tuşlu modeller</p>
            </Link>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="mt-12 pt-8 border-t border-brand-navy-900">
          <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 text-center">
            Popüler Marka & Model Grupları
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {popularBrands.map((b) => (
              <Link
                key={b.name}
                href={`/arama?q=${encodeURIComponent(b.name)}`}
                className="py-2.5 px-3 rounded-xl bg-brand-navy-900 border border-brand-navy-800 hover:border-brand-navy-600 hover:bg-brand-navy-800 text-center text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <span>{b.name}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

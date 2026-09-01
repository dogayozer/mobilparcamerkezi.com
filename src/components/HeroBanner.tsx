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
  ArrowRight,
  CheckCircle2
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
    { name: 'Apple iPhone', slug: 'apple' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Xiaomi & Redmi', slug: 'xiaomi' },
    { name: 'Huawei', slug: 'huawei' },
    { name: 'Oppo & Realme', slug: 'oppo' },
    { name: 'Nokia / Tuşlu', slug: 'nokia' },
  ]

  const quickCats = [
    { href: '/kategori/batarya', icon: BatteryCharging, title: 'Bataryalar', desc: 'Yüksek kapasiteli, orijinal korumalı piller' },
    { href: '/kategori/kasa', icon: Smartphone, title: 'Kasa & Kapaklar', desc: 'Birebir oturan tam uyumlu arka gövde' },
    { href: '/kategori/sarj-aleti', icon: Zap, title: 'Şarj & Kablolar', desc: 'Hızlı şarj destekli adaptör ve kablolar' },
    { href: '/kategori/tus-takimi', icon: Layers, title: 'Tuş Takımı & Flex', desc: 'Tüm klasik ve yeni tuşlu modeller' },
  ]

  return (
    <div className="relative overflow-hidden bg-ink text-[#f3ede0]">
      <div className="absolute inset-0 grid-tex opacity-60 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-12">
          {/* Left Column: Headline & Quick Device Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-yellow-500/10 border border-yellow-500/40 text-yellow-500 text-[11px] font-mono font-bold tracking-wide">
              <span className="w-1.5 h-1.5 bg-yellow-500" />
              <span>SİRKECİ'DEN TÜRKİYE'YE TOPTAN SEVKİYAT</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[0.98]">
              Cihazınıza <span className="text-yellow-500">Tam Uyumlu</span> Yedek Parça
            </h1>

            <p className="text-sm sm:text-base text-[#b8b0a0] max-w-xl font-normal leading-relaxed">
              Telefon bataryası, kasa, kapak, şarj soketi, tuş takımı ve koruyucu camlarda en yüksek kalite standardı. Saat 16:30'a kadar aynı gün kargo avantajıyla.
            </p>

            {/* Smart Device Finder Widget */}
            <div className="p-4 sm:p-5 rounded-md bg-white/[0.03] border border-yellow-500/25">
              <div className="flex items-center gap-2 mb-3 text-[11px] font-mono font-bold text-yellow-500 uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Model Uyumluluk Sorgusu</span>
              </div>

              <form onSubmit={handleFinderSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-mono text-[#8a8272] mb-1 uppercase">1. Marka</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-ink-900 border border-yellow-500/20 rounded-md px-3 py-2 text-xs text-[#f3ede0] focus:outline-none focus:border-yellow-500"
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
                  <label className="block text-[10px] font-mono text-[#8a8272] mb-1 uppercase">2. Cihaz Modeli</label>
                  <input
                    type="text"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="Örn: iPhone 11, Note 8"
                    className="w-full bg-ink-900 border border-yellow-500/20 rounded-md px-3 py-2 text-xs text-[#f3ede0] placeholder:text-[#5c5548] focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md bg-yellow-500 hover:bg-yellow-400 text-ink text-xs font-display font-bold uppercase flex items-center justify-center gap-2 transition duration-200"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Parçaları Bul</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: honest "how it works" spec panel */}
          <div className="lg:col-span-5">
            <div className="relative border border-yellow-500/25 bg-gradient-to-br from-[#211d15] to-ink rounded-md p-6">
              <div className="absolute w-5 h-5 top-2.5 left-2.5 border-t-2 border-l-2 border-yellow-500" />
              <div className="absolute w-5 h-5 top-2.5 right-2.5 border-t-2 border-r-2 border-yellow-500" />
              <div className="absolute w-5 h-5 bottom-2.5 left-2.5 border-b-2 border-l-2 border-yellow-500" />
              <div className="absolute w-5 h-5 bottom-2.5 right-2.5 border-b-2 border-r-2 border-yellow-500" />

              <div className="font-mono text-[11px] uppercase tracking-wider text-yellow-500 mb-4">◆ Nasıl Çalışır?</div>
              <div className="flex flex-col gap-3">
                {[
                  ['Adım 1', 'Marka ve modelinizi seçin'],
                  ['Adım 2', 'Uyumlu parçaları filtreleyin'],
                  ['Adım 3', 'Sepete ekleyin, aynı gün kargoya verilsin'],
                ].map(([step, desc]) => (
                  <div key={step} className="flex items-start gap-3 font-mono text-[11px] border-b border-dashed border-yellow-500/15 pb-3">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[#8a8272] uppercase">{step}</div>
                      <div className="text-[#f3ede0] text-[12.5px] mt-0.5 font-sans normal-case">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-yellow-500/15 flex items-start gap-3 font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#8a8272] uppercase">Sertifikalı Bataryalar</div>
                  <div className="text-[#f3ede0] text-[12.5px] mt-0.5 font-sans normal-case">IEC 62133 · UN 38.3 standartlarına uygun</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pb-12">
          {quickCats.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group p-4 rounded-md bg-white/[0.02] border border-yellow-500/15 hover:border-yellow-500/50 transition-all"
            >
              <div className="w-10 h-10 rounded-md bg-yellow-500/10 text-yellow-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-display font-bold uppercase text-white group-hover:text-yellow-500 transition">
                {c.title}
              </h3>
              <p className="text-[11px] text-[#8a8272] mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>

        {/* Brand Bar */}
        <div className="pb-10 pt-2 border-t border-yellow-500/10">
          <span className="block text-[11px] font-mono font-bold uppercase tracking-widest text-[#8a8272] mb-4 text-center pt-8">
            Popüler Marka & Model Grupları
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {popularBrands.map((b) => (
              <Link
                key={b.name}
                href={`/arama?q=${encodeURIComponent(b.name)}`}
                className="py-2.5 px-3 rounded-md bg-white/[0.02] border border-yellow-500/15 hover:border-yellow-500/40 text-center text-xs font-semibold text-[#b8b0a0] hover:text-yellow-500 transition flex items-center justify-center gap-1.5"
              >
                <span>{b.name}</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hazard-stripe" />
    </div>
  )
}

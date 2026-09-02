'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Phone,
  Truck,
  ShieldCheck,
  Zap,
  ChevronDown,
  Layers,
  Sparkles,
  Package,
  Wrench
} from 'lucide-react'

interface HeaderProps {
  categories?: Array<{ id: string; name: string; slug: string; _count?: { products: number } }>
  settings?: any
}

/* Marka rozeti — siyah kart üzerinde sarı "M" işareti (mobilparcamerkezi.com) */
function BrandMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 20V6h4l4 7 4-7h4v14"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BrandWordmark({ size = 'text-lg sm:text-xl' }: { size?: string }) {
  return (
    <div className="leading-none">
      <div className={`${size} font-display font-extrabold uppercase tracking-tight text-ink leading-none`}>
        mobilparça<span className="text-yellow-700">merkezi</span>
      </div>
      <span className="font-mono text-[9.5px] tracking-[0.16em] text-ink-soft uppercase block mt-0.5">
        Cep Telefonu Parça Toptan · Sirkeci
      </span>
    </div>
  )
}

/* Gerçek zamanlı, Europe/Istanbul saatine göre hesaplanan kargo kesim geri sayımı */
function useShippingCountdown(cutoff: string = '16:30') {
  const [label, setLabel] = useState('Hesaplanıyor…')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const [ch, cm] = cutoff.split(':').map((n) => parseInt(n, 10))
    const tick = () => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        weekday: 'short',
      }).formatToParts(new Date())
      const get = (t: string) => parts.find((p) => p.type === t)?.value || '0'
      const h = parseInt(get('hour'), 10)
      const m = parseInt(get('minute'), 10)
      const s = parseInt(get('second'), 10)
      const weekday = get('weekday')
      const nowSec = h * 3600 + m * 60 + s
      const cutoffSec = (ch || 16) * 3600 + (cm || 0) * 60

      if (weekday === 'Sun') {
        setIsOpen(false)
        setLabel('Kargo Pazartesi işleme alınır')
        return
      }
      if (nowSec < cutoffSec) {
        const remain = cutoffSec - nowSec
        const rh = Math.floor(remain / 3600)
        const rm = Math.floor((remain % 3600) / 60)
        const rs = remain % 60
        setIsOpen(true)
        setLabel(`${rh > 0 ? rh + ' sa ' : ''}${rm} dk ${rs.toString().padStart(2, '0')} sn`)
      } else {
        setIsOpen(false)
        setLabel('Sonraki iş günü kargoya verilir')
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [cutoff])

  return { label, isOpen }
}

export default function Header({ categories = [], settings }: HeaderProps) {
  const router = useRouter()
  const { totalItems, setIsCartOpen } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { label: shippingLabel, isOpen: shippingOpen } = useShippingCountdown(settings?.sameDayShippingTime || '16:30')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      <div className="hazard-stripe" />
      {/* Top Notification Bar */}
      <div className="bg-ink text-[#cfc7b6] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            {shippingOpen ? (
              <div className="flex items-center gap-1.5 font-mono">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span>
                  <strong className="text-yellow-500">AYNI GÜN KARGO</strong> için son{' '}
                  <strong className="text-white tabular-nums">{shippingLabel}</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-mono text-[#a89f8c]">
                <Zap className="w-3.5 h-3.5" />
                <span>{shippingLabel}</span>
              </div>
            )}
            <div className="hidden md:flex items-center gap-1.5 text-[#a89f8c]">
              <Truck className="w-3.5 h-3.5 text-yellow-500" />
              <span>{settings?.shippingThreshold ? `${settings.shippingThreshold} TL ve üzeri Ücretsiz Kargo` : '500 TL ve üzeri Ücretsiz Kargo'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/kargo-takibi"
              className="hover:text-white transition flex items-center gap-1 font-medium"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Kargo Takibi</span>
            </Link>
            <span className="text-[#413c32]">|</span>
            <a
              href={`https://wa.me/${settings?.whatsappPhone || '905445774257'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-yellow-500" />
              <span>WhatsApp Destek</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`transition-all duration-200 border-b-[3px] border-ink ${isScrolled ? 'bg-paper/95 backdrop-blur-md shadow-md py-3' : 'bg-paper py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 rounded-lg bg-ink flex items-center justify-center text-yellow-500 group-hover:scale-105 transition-transform">
              <div className="absolute inset-[3px] rounded-md border border-yellow-500/70 pointer-events-none" />
              <BrandMark className="w-5 h-5" />
            </div>
            <BrandWordmark />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="w-full flex items-stretch h-[46px] border-[2.5px] border-ink rounded-md overflow-hidden bg-white">
              <div className="w-9 flex items-center justify-center bg-ink text-yellow-500 font-mono font-semibold text-sm">
                &gt;
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="model kodu veya parça ara — örn: iphone-11-ekran"
                className="flex-1 px-3 text-[13px] font-mono text-ink placeholder:text-ink-soft/70 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 border-l-[2.5px] border-ink bg-yellow-500 hover:bg-yellow-400 text-ink text-xs font-display font-bold uppercase tracking-wide transition"
              >
                Ara
              </button>
            </form>
          </div>

          {/* Actions: Account & Cart */}
          <div className="flex items-center gap-3">
            {/* Account Link */}
            <Link
              href="/hesabim"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-md text-ink hover:text-yellow-700 hover:bg-paper-2 transition"
            >
              <div className="w-8 h-8 rounded-md bg-paper-2 flex items-center justify-center text-ink-soft">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-[11px] text-ink-soft block leading-tight">Hesabım</span>
                <span className="text-xs font-bold text-ink">Giriş / Kayıt</span>
              </div>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-md bg-ink text-yellow-500 hover:bg-ink-900 transition-all border-[2.5px] border-ink group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-ink text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-ink">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-display font-bold uppercase hidden sm:inline-block">Sepetim</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-ink hover:bg-paper-2 rounded-md"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pt-3 pb-1">
          <form onSubmit={handleSearch} className="flex items-stretch h-11 border-2 border-ink rounded-md overflow-hidden bg-white">
            <div className="w-8 flex items-center justify-center bg-ink text-yellow-500 font-mono text-xs">&gt;</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Model veya yedek parça ara..."
              className="flex-1 px-3 text-sm font-mono text-ink focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-3 bg-yellow-500 text-ink text-xs font-display font-bold uppercase"
            >
              Bul
            </button>
          </form>
        </div>
      </div>

      {/* Navigation & Categories Bar (Desktop) */}
      <div className="hidden md:block bg-white border-b border-ink/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            {/* All Categories Dropdown Trigger */}
            <div className="relative group">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-ink text-yellow-500 text-xs font-display font-bold uppercase tracking-wider transition"
              >
                <Layers className="w-4 h-4" />
                <span>TÜM KATEGORİLER</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {/* Mega Dropdown */}
              <div className="absolute top-full left-0 w-72 bg-white shadow-2xl border border-ink/15 py-2 hidden group-hover:block transition-all z-50">
                {categories.length === 0 ? (
                  <div className="p-4 text-xs text-ink-soft font-mono">Kategoriler yükleniyor...</div>
                ) : (
                  categories.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/kategori/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-ink hover:bg-yellow-50 hover:text-yellow-800 transition"
                    >
                      <span>{cat.name}</span>
                      {cat._count?.products !== undefined && (
                        <span className="text-[10px] text-ink-soft bg-paper-2 px-2 py-0.5 rounded-full font-mono">
                          {cat._count.products}
                        </span>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center pl-3 text-[11px] font-mono font-semibold text-ink-soft">
              <Link href="/kategori/batarya" className="px-3.5 py-3 hover:text-yellow-800 transition border-r border-ink/10">
                BATARYALAR
              </Link>
              <Link href="/kategori/telefon-kasasi" className="px-3.5 py-3 hover:text-yellow-800 transition border-r border-ink/10">
                KASA &amp; KAPAK
              </Link>
              <Link href="/kategori/sarj-aleti" className="px-3.5 py-3 hover:text-yellow-800 transition border-r border-ink/10">
                ŞARJ &amp; KABLO
              </Link>
              <Link href="/kategori/tus-takimlari" className="px-3.5 py-3 hover:text-yellow-800 transition border-r border-ink/10">
                TUŞ TAKIMLARI
              </Link>
              <Link href="/kategori/ekranlar-ve-koruyucular" className="px-3.5 py-3 hover:text-yellow-800 transition">
                EKRAN KORUYUCULAR
              </Link>
            </nav>
          </div>

          {/* Special Promotion Badge */}
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-ink bg-yellow-100 px-3 py-1.5 rounded-md border border-yellow-300">
            <Sparkles className="w-3.5 h-3.5 text-yellow-700" />
            <span>%100 TEST EDİLMİŞ GARANTİLİ PARÇALAR</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-paper shadow-2xl flex flex-col">
            <div className="p-4 border-b-[3px] border-ink flex items-center justify-between bg-ink text-yellow-500">
              <div className="flex items-center gap-2">
                <BrandMark className="w-5 h-5" />
                <span className="font-display font-bold text-sm uppercase">Mobil Parça Merkezi</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-[#a89f8c] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase text-ink-soft tracking-wider">
                  Kategoriler
                </span>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 text-sm font-semibold text-ink rounded-md hover:bg-yellow-100"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-ink/15 space-y-2">
                <Link
                  href="/kargo-takibi"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-ink"
                >
                  <Package className="w-4 h-4 text-yellow-700" />
                  <span>Kargo Takibi</span>
                </Link>
                <Link
                  href="/hesabim"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-ink"
                >
                  <User className="w-4 h-4 text-yellow-700" />
                  <span>Hesabım</span>
                </Link>
                <Link
                  href="/hakkimizda"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-ink"
                >
                  <ShieldCheck className="w-4 h-4 text-yellow-700" />
                  <span>Hakkımızda & Garanti</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

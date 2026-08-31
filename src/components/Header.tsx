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

/* Marka simgesi — lacivert/kırmızı devre motifi (mobilparcamerkezi.com logosundan) */
function BrandMark({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 17V9a2 2 0 0 1 2-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M20 7v8a2 2 0 0 1-2 2h-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="17" r="1.6" fill="currentColor" />
      <circle cx="20" cy="7" r="1.6" fill="currentColor" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BrandWordmark({ size = 'text-lg sm:text-xl' }: { size?: string }) {
  return (
    <div className="leading-none">
      <div className="flex items-baseline gap-0.5">
        <span className={`${size} font-extrabold tracking-tight text-brand-navy-900 leading-none`}>
          mobilparça
        </span>
        <span className={`${size} font-extrabold tracking-tight text-brand-red-500 leading-none`}>
          merkezi
        </span>
      </div>
      <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase block mt-0.5">
        Cep Telefonu Parça Toptan
      </span>
    </div>
  )
}

export default function Header({ categories = [], settings }: HeaderProps) {
  const router = useRouter()
  const { totalItems, setIsCartOpen } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const quickSearches = [
    'iPhone Batarya',
    'Samsung Ekran',
    'Xiaomi Kasa',
    'Şarj Soketi',
    'Kamera Camı',
    'Type-C Kablo'
  ]

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Notification Bar */}
      <div className="bg-brand-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-brand-navy-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>Saat 16:30'a kadar verilen siparişler <strong>AYNI GÜN KARGO</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-brand-navy-300" />
              <span>500 TL ve üzeri Ücretsiz Kargo</span>
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
            <span className="text-slate-700">|</span>
            <a
              href={`https://wa.me/${settings?.whatsappPhone || '905000000000'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition flex items-center gap-1 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp Destek</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`transition-all duration-200 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-4 border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-navy-800 to-brand-red-600 flex items-center justify-center text-white shadow-lg shadow-brand-navy-900/30 group-hover:scale-105 transition-transform">
              <BrandMark className="w-5 h-5" />
            </div>
            <BrandWordmark />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Telefon modeli (örn: iPhone 11, Redmi Note 8) veya parça arayın..."
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-2.5 pl-11 pr-24 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy-600 focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-red-500 hover:bg-brand-red-600 text-white text-xs font-bold rounded-xl transition shadow-sm"
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
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-slate-700 hover:text-brand-navy-700 hover:bg-slate-100 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-[11px] text-slate-400 block leading-tight">Hesabım</span>
                <span className="text-xs font-bold text-slate-800">Giriş / Kayıt</span>
              </div>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-navy-900 text-white hover:bg-brand-red-500 transition-all shadow-md group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-navy-900 animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline-block">Sepetim</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pt-3 pb-1">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Model veya yedek parça ara..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-navy-600 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-red-500 text-white text-xs font-bold rounded-lg"
            >
              Bul
            </button>
          </form>
        </div>
      </div>

      {/* Navigation & Categories Bar (Desktop) */}
      <div className="hidden md:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* All Categories Dropdown Trigger */}
            <div className="relative group">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-brand-navy-800 text-white text-xs font-bold uppercase tracking-wider rounded-t-lg hover:bg-brand-navy-900 transition"
              >
                <Layers className="w-4 h-4" />
                <span>TÜM KATEGORİLER</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {/* Mega Dropdown */}
              <div className="absolute top-full left-0 w-72 bg-white shadow-2xl rounded-b-2xl border border-slate-200 py-2 hidden group-hover:block transition-all z-50">
                {categories.length === 0 ? (
                  <div className="p-4 text-xs text-slate-500">Kategoriler yükleniyor...</div>
                ) : (
                  categories.slice(0, 10).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/kategori/${cat.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-brand-navy-50 hover:text-brand-navy-700 transition"
                    >
                      <span>{cat.name}</span>
                      {cat._count?.products !== undefined && (
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {cat._count.products}
                        </span>
                      )}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <nav className="flex items-center space-x-1 pl-3 text-xs font-bold text-slate-700">
              <Link
                href="/kategori/batarya"
                className="px-3.5 py-3 hover:text-brand-red-600 transition flex items-center gap-1.5"
              >
                <span>Bataryalar</span>
              </Link>
              <Link
                href="/kategori/kasa"
                className="px-3.5 py-3 hover:text-brand-red-600 transition flex items-center gap-1.5"
              >
                <span>Kasa & Kapak</span>
              </Link>
              <Link
                href="/kategori/sarj-aleti"
                className="px-3.5 py-3 hover:text-brand-red-600 transition flex items-center gap-1.5"
              >
                <span>Şarj & Kablo</span>
              </Link>
              <Link
                href="/kategori/tus-takimi"
                className="px-3.5 py-3 hover:text-brand-red-600 transition flex items-center gap-1.5"
              >
                <span>Tuş Takımları</span>
              </Link>
              <Link
                href="/kategori/koruyucu"
                className="px-3.5 py-3 hover:text-brand-red-600 transition flex items-center gap-1.5"
              >
                <span>Ekran Koruyucular</span>
              </Link>
            </nav>
          </div>

          {/* Special Promotion Badge */}
          <div className="flex items-center gap-2 text-xs font-extrabold text-brand-navy-800 bg-brand-navy-50 px-3 py-1.5 rounded-full border border-brand-navy-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>%100 Test Edilmiş Garantili Parçalar</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-brand-navy-950/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-brand-navy-950 text-white">
              <div className="flex items-center gap-2">
                <BrandMark className="w-5 h-5 text-brand-red-400" />
                <span className="font-bold text-sm">Mobil Parça Merkezi</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Kategoriler
                </span>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2.5 px-3 text-sm font-semibold text-slate-700 rounded-xl hover:bg-brand-navy-50 hover:text-brand-navy-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <Link
                  href="/kargo-takibi"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-slate-700"
                >
                  <Package className="w-4 h-4 text-brand-navy-700" />
                  <span>Kargo Takibi</span>
                </Link>
                <Link
                  href="/hesabim"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-slate-700"
                >
                  <User className="w-4 h-4 text-brand-navy-700" />
                  <span>Hesabım</span>
                </Link>
                <Link
                  href="/hakkimizda"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-slate-700"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-navy-700" />
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

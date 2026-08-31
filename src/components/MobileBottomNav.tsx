'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function MobileBottomNav() {
  const pathname = usePathname()
  const { totalItems, setIsCartOpen } = useCart()

  if (pathname.startsWith('/admin')) return null

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex items-center justify-around shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
          pathname === '/' ? 'text-brand-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Ana Sayfa</span>
      </Link>

      <Link
        href="/kategori/batarya"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
          pathname.startsWith('/kategori') ? 'text-brand-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Kategori</span>
      </Link>

      <Link
        href="/arama"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
          pathname.startsWith('/arama') ? 'text-brand-red-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px]">Arama</span>
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 p-1.5 rounded-xl text-slate-500 hover:text-slate-900 transition"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px]">Sepetim</span>
      </button>

      <Link
        href="/hesabim"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition ${
          pathname.startsWith('/hesabim') || pathname.startsWith('/giris')
            ? 'text-brand-red-600 font-bold'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Hesabım</span>
      </Link>
    </div>
  )
}

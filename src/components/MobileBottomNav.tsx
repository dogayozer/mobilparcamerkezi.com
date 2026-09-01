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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/95 backdrop-blur-md border-t-[3px] border-ink px-2 py-2 flex items-center justify-around shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-md transition ${
          pathname === '/' ? 'text-yellow-700 font-bold' : 'text-ink-soft hover:text-ink'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-mono">Ana Sayfa</span>
      </Link>

      <Link
        href="/kategori/batarya"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-md transition ${
          pathname.startsWith('/kategori') ? 'text-yellow-700 font-bold' : 'text-ink-soft hover:text-ink'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px] font-mono">Kategori</span>
      </Link>

      <Link
        href="/arama"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-md transition ${
          pathname.startsWith('/arama') ? 'text-yellow-700 font-bold' : 'text-ink-soft hover:text-ink'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-mono">Arama</span>
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 p-1.5 rounded-md text-ink-soft hover:text-ink transition"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-yellow-500 text-ink text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono">Sepetim</span>
      </button>

      <Link
        href="/hesabim"
        className={`flex flex-col items-center gap-1 p-1.5 rounded-md transition ${
          pathname.startsWith('/hesabim') || pathname.startsWith('/giris')
            ? 'text-yellow-700 font-bold'
            : 'text-ink-soft hover:text-ink'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-mono">Hesabım</span>
      </Link>
    </div>
  )
}

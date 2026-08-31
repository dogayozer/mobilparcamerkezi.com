'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Check, Zap, Eye, ShieldCheck, Heart } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    title: string
    slug: string
    barcode: string
    model_code?: string | null
    brand?: string | null
    sale_price: number
    reference_price?: number | null
    stock_qty: number
    status: string
    images?: Array<{ url: string }>
    category?: { name: string; slug?: string } | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl =
    product.images?.[0]?.url || 'https://placehold.co/400x400/0c3864/ffffff?text=MPM'

  const discountPercent =
    product.reference_price && product.reference_price > product.sale_price
      ? Math.round(((product.reference_price - product.sale_price) / product.reference_price) * 100)
      : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const isOutOfStock = product.stock_qty <= 0 || product.status === 'out_of_stock'

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-brand-red-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-brand-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-md tracking-wider">
            %{discountPercent} İNDİRİM
          </span>
        )}
        <span className="bg-brand-navy-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
          <Zap className="w-3 h-3 text-amber-400" />
          Hızlı Kargo
        </span>
      </div>

      {/* Stock / Original Badge Right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Garantili
        </span>
      </div>

      {/* Product Image Area */}
      <Link href={`/urun/${product.slug}`} className="block relative pt-[100%] bg-slate-50 overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-contain p-4 group-hover:scale-108 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
            <span className="text-brand-navy-700 font-bold uppercase tracking-wider">
              {product.brand || 'Orijinal Uyumlu'}
            </span>
            {product.category && (
              <span className="truncate max-w-[110px]">{product.category.name}</span>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/urun/${product.slug}`}
            className="block text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-red-600 line-clamp-2 transition leading-snug mb-2"
            title={product.title}
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 border-t border-slate-100 mt-2">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900">
              {formatPrice(product.sale_price)}
            </span>
            {product.reference_price && product.reference_price > product.sale_price && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.reference_price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-brand-red-500 hover:bg-brand-red-600 text-white shadow-brand-red-500/20 hover:shadow-md'
            }`}
          >
            {isOutOfStock ? (
              <span>Tükendi</span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Sepete Eklendi</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Sepete Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

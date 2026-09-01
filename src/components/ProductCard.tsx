'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Check, Zap, ShieldCheck } from 'lucide-react'

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

  const imageUrl =
    product.images?.[0]?.url || 'https://placehold.co/400x400/171410/f5b400?text=MPM'

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
  const isLowStock = !isOutOfStock && product.stock_qty <= 10

  return (
    <div className="group relative bg-white rounded-md border border-ink/15 hover:border-ink hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-yellow-500 text-ink text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-sm tracking-wide">
            %{discountPercent}
          </span>
        )}
        {isLowStock && (
          <span className="bg-ink text-yellow-500 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-sm tracking-wide">
            SON {product.stock_qty} ADET
          </span>
        )}
      </div>

      {/* Trust badge */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Test Edildi
        </span>
      </div>

      {/* Product Image Area */}
      <Link href={`/urun/${product.slug}`} className="block relative pt-[100%] bg-paper-2 overflow-hidden border-b border-ink/10">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* SKU + Category */}
          <div className="flex items-center justify-between text-[10px] font-mono text-ink-soft mb-1.5">
            <span className="truncate">{product.model_code || product.barcode}</span>
            {product.category && (
              <span className="truncate max-w-[100px] uppercase">{product.category.name}</span>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/urun/${product.slug}`}
            className="block text-xs sm:text-[13px] font-semibold text-ink hover:text-yellow-800 line-clamp-2 transition leading-snug mb-2"
            title={product.title}
          >
            {product.title}
          </Link>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 border-t border-dashed border-ink/15 mt-2">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-display font-extrabold text-ink">
              {formatPrice(product.sale_price)}
            </span>
            {product.reference_price && product.reference_price > product.sale_price && (
              <span className="text-xs font-mono text-ink-soft line-through">
                {formatPrice(product.reference_price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-3 rounded-md text-[11.5px] font-display font-bold uppercase transition flex items-center justify-center gap-2 ${
              isOutOfStock
                ? 'bg-paper-2 text-ink-soft cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-ink text-yellow-500 hover:bg-yellow-500 hover:text-ink'
            }`}
          >
            {isOutOfStock ? (
              <span>Tükendi</span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Eklendi</span>
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

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Smartphone,
  CheckCircle2,
  Share2,
  Phone
} from 'lucide-react'

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: 'https://placehold.co/600x600/1e293b/ffffff?text=MPM' }]

  const discountPercent =
    product.reference_price && product.reference_price > product.sale_price
      ? Math.round(((product.reference_price - product.sale_price) / product.reference_price) * 100)
      : 0

  const isOutOfStock = product.stock_qty <= 0 || product.status === 'out_of_stock'

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    router.push('/odeme')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
      {/* Left: Image Gallery (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Main Image */}
        <div className="relative pt-[100%] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner group">
          <Image
            src={images[selectedImageIndex]?.url || images[0].url}
            alt={product.title}
            fill
            priority
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />

          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg">
              %{discountPercent} İNDİRİM
            </span>
          )}
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-2">
            {images.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-18 h-18 rounded-xl border-2 shrink-0 bg-slate-50 overflow-hidden transition ${
                  selectedImageIndex === idx
                    ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img.url} alt={`Thumb ${idx}`} fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Details & Purchase Actions (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
        <div>
          {/* Brand & Stock Badges */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              {product.brand || 'Orijinal Standart'}
            </span>

            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
                Stokta Yok
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Stokta Hazır ({product.stock_qty} Adet)
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug">
            {product.title}
          </h1>

          {/* Model code and barcode */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2 font-mono">
            <span>Barkod: <strong className="text-slate-600">{product.barcode}</strong></span>
            {product.model_code && (
              <>
                <span>•</span>
                <span>Model Kodu: <strong className="text-slate-600">{product.model_code}</strong></span>
              </>
            )}
          </div>

          {/* Price Block */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Özel İndirimli Fiyat</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {formatPrice(product.sale_price)}
                </span>
                {product.reference_price && product.reference_price > product.sale_price && (
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(product.reference_price)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                KDV Dahil
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Saat 16:30 öncesi Aynı Gün Kargo</p>
            </div>
          </div>

          {/* Actions: Quantity + Add to Cart + Buy Now */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-slate-600 hover:text-blue-600 disabled:opacity-40 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_qty || 99, quantity + 1))}
                  disabled={quantity >= (product.stock_qty || 99) || isOutOfStock}
                  className="p-2 text-slate-600 hover:text-blue-600 disabled:opacity-40 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add To Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:scale-[1.01]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Sepete Eklendi</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Sepete Ekle</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Buy Now Button */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold transition shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Hemen Satın Al (Tek Tıkla Ödeme)</span>
              </button>
            )}
          </div>
        </div>

        {/* Trust & Guarantee Box */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Truck className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 block">Aynı Gün Kargo</span>
              <span className="text-[11px] text-slate-500">16:30'a kadar verilen siparişlerde</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 block">%100 Test Edilmiş</span>
              <span className="text-[11px] text-slate-500">Tam Uyum ve Değişim Garantisi</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Support Button */}
        <a
          href={`https://wa.me/905000000000?text=${encodeURIComponent(
            `Merhaba, "${product.title}" (${product.barcode}) ürünü hakkında bilgi almak istiyorum.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition"
        >
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Bu Parça Cihazıma Uyar mı? WhatsApp'tan Sor</span>
        </a>
      </div>

      {/* Description & Technical Information (12 cols) */}
      <div className="lg:col-span-12 mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-black text-slate-900 mb-4">Ürün Açıklaması ve Özellikleri</h3>
        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
          {product.description_raw ? (
            <div className="whitespace-pre-line">{product.description_raw}</div>
          ) : (
            <p>
              Bu yedek parça yüksek kalite standartlarında üretilmiş olup cihazınız ile %100 uyumludur. Siparişiniz öncesinde model kodunuzu kontrol ediniz.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

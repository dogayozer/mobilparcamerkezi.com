'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)
  const [couponError, setCouponError] = useState('')

  const freeShippingThreshold = 500
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
  const shippingFee = totalPrice >= freeShippingThreshold || totalPrice === 0 ? 0 : 90

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const grandTotal = Math.max(0, totalPrice - discountAmount + shippingFee)

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError('')
    if (!couponCode.trim()) return

    try {
      const res = await fetch(`/api/coupon?code=${encodeURIComponent(couponCode.trim())}`)
      const data = await res.json()
      if (res.ok && data.valid) {
        const disc = data.type === 'percentage' ? (totalPrice * data.value) / 100 : data.value
        setAppliedCoupon({ code: data.code, discount: disc })
      } else {
        setCouponError('Geçersiz veya süresi dolmuş kupon kodu.')
      }
    } catch (e) {
      setCouponError('Kupon sorgulanırken bir hata oluştu.')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-400">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Alışveriş Sepetiniz Boş</h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
          Aradığınız telefon yedek parça ve aksesuarlarını hemen inceleyip sepetinize ekleyebilirsiniz.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/30"
        >
          <span>Alışverişe Başla</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Alışveriş Sepetim</h1>
          <p className="text-xs text-slate-500 mt-1">Sepetinizde {totalItems} adet ürün bulunuyor</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Sepeti Temizle</span>
        </button>
      </div>

      {/* Free Shipping Alert */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-blue-900 font-semibold">
          <Truck className="w-5 h-5 text-blue-600" />
          {remainingForFreeShipping === 0 ? (
            <span className="text-emerald-700 font-bold">🎉 Tebrikler! Siparişinizde Kargo ÜCRETSİZ!</span>
          ) : (
            <span>
              Ücretsiz kargo fırsatından yararlanmak için sepetinize{' '}
              <strong className="text-blue-700">{formatPrice(remainingForFreeShipping)}</strong> değerinde ürün ekleyin.
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Item List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                  <Image
                    src={item.image || 'https://placehold.co/400x400/1e293b/ffffff?text=MPM'}
                    alt={item.title}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0">
                  {item.brand && (
                    <span className="text-[11px] font-bold text-blue-600 uppercase">
                      {item.brand}
                    </span>
                  )}
                  <Link
                    href={`/urun/${item.slug}`}
                    className="block text-sm font-bold text-slate-900 hover:text-blue-600 transition line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                    Barkod: {item.barcode}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1 text-slate-600 hover:text-blue-600 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1 text-slate-600 hover:text-blue-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 block">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-[11px] text-slate-400">
                      Birim: {formatPrice(item.price)}
                    </span>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition"
                  title="Ürünü Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Alışverişe Devam Et</span>
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>İndirim Kuponu</span>
            </label>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Kupon Kodunuz"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Uygula
              </button>
            </form>
            {couponError && <p className="text-xs text-rose-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{appliedCoupon.code} kuponu uygulandı (-{formatPrice(appliedCoupon.discount)})</span>
              </p>
            )}
          </div>

          {/* Summary Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Sipariş Özeti
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ürünler Toplamı</span>
                <span className="font-bold text-slate-800">{formatPrice(totalPrice)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Kupon İndirimi</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Kargo Bedeli</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">Ücretsiz</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Ödenecek Tutar</span>
                <span className="text-blue-600 text-xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/odeme"
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <span>Ödemeye Geç</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL ile %100 Güvenli Alışveriş</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

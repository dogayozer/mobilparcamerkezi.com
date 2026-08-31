'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react'

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  if (!isCartOpen) return null

  const freeShippingThreshold = 500
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice)
  const shippingProgress = Math.min(100, (totalPrice / freeShippingThreshold) * 100)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Alışveriş Sepetim</h2>
                <p className="text-xs text-slate-300">{totalItems} adet ürün eklendi</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <div className="flex items-center gap-1.5 text-blue-700">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-600 font-bold">🎉 Tebrikler! Kargonuz Bedava</span>
                ) : (
                  <span>
                    Ücretsiz kargo için <strong className="text-blue-900">{formatPrice(remainingForFreeShipping)}</strong> daha ekleyin
                  </span>
                )}
              </div>
              <span className="text-slate-500">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-1">Sepetiniz Boş</h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  Cihazınıza uygun telefon parçalarını ve aksesuarlarını hemen keşfedin.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-slate-300 transition"
                >
                  <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <Image
                      src={item.image || 'https://placehold.co/400x400/1e293b/ffffff?text=MPM'}
                      alt={item.title}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/urun/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition leading-snug"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                          title="Kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.brand && (
                        <span className="inline-block text-[11px] font-medium text-slate-500 mt-0.5">
                          {item.brand}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-blue-600 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-blue-600 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-slate-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200/80 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Ara Toplam</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Kargo Ücreti</span>
                  <span>
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-600 font-bold">Ücretsiz</span>
                    ) : (
                      formatPrice(90)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Genel Toplam</span>
                  <span className="text-blue-600 text-lg">
                    {formatPrice(totalPrice + (remainingForFreeShipping === 0 ? 0 : 90))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/sepet"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 bg-white text-center text-sm font-bold hover:bg-slate-100 transition shadow-sm"
                >
                  Sepete Git
                </Link>
                <Link
                  href="/odeme"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-xl bg-blue-600 text-white text-center text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/25"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL ile %100 Güvenli Ödeme</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

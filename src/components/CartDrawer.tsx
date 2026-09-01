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
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-paper shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b-[3px] border-ink flex items-center justify-between bg-ink text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 text-ink rounded-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold uppercase">Alışveriş Sepetim</h2>
                <p className="text-xs text-[#b8b0a0] font-mono">{totalItems} adet ürün eklendi</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-md text-[#8a8272] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between text-xs font-semibold text-ink mb-1.5">
              <div className="flex items-center gap-1.5 text-yellow-800">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-bold">🎉 Tebrikler! Kargonuz Bedava</span>
                ) : (
                  <span>
                    Ücretsiz kargo için <strong className="text-ink">{formatPrice(remainingForFreeShipping)}</strong> daha ekleyin
                  </span>
                )}
              </div>
              <span className="text-ink-soft font-mono">{Math.round(shippingProgress)}%</span>
            </div>
            <div className="w-full bg-yellow-200/70 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-ink-soft py-12">
                <div className="w-20 h-20 rounded-full bg-paper-2 flex items-center justify-center mb-4 text-ink/25">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-ink mb-1">Sepetiniz Boş</h3>
                <p className="text-sm text-ink-soft max-w-xs mb-6">
                  Cihazınıza uygun telefon parçalarını ve aksesuarlarını hemen keşfedin.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-ink text-yellow-500 rounded-md text-sm font-display font-bold uppercase hover:bg-ink-900 transition"
                >
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-3.5 bg-white border border-ink/12 rounded-md hover:border-ink/25 transition"
                >
                  <div className="relative w-20 h-20 bg-paper-2 rounded-md overflow-hidden shrink-0 border border-ink/10">
                    <Image
                      src={item.image || 'https://placehold.co/400x400/171410/f5b400?text=MPM'}
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
                          className="text-sm font-semibold text-ink line-clamp-2 hover:text-yellow-800 transition leading-snug"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-ink-soft hover:text-red-600 p-1 transition"
                          title="Kaldır"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.brand && (
                        <span className="inline-block text-[11px] font-mono text-ink-soft mt-0.5">
                          {item.brand}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-ink/12">
                      <div className="flex items-center border border-ink/15 rounded-md bg-paper-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-ink-soft hover:text-yellow-800 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-ink font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-ink-soft hover:text-yellow-800 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-display font-extrabold text-ink">
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
            <div className="p-6 bg-white border-t-[3px] border-ink space-y-4">
              <div className="space-y-2 font-mono">
                <div className="flex justify-between text-sm text-ink-soft">
                  <span>Ara Toplam</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-ink-soft">
                  <span>Kargo Ücreti</span>
                  <span>
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">Ücretsiz</span>
                    ) : (
                      formatPrice(90)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-display font-extrabold text-ink pt-2 border-t border-dashed border-ink/15">
                  <span className="uppercase">Genel Toplam</span>
                  <span className="text-lg">
                    {formatPrice(totalPrice + (remainingForFreeShipping === 0 ? 0 : 90))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/sepet"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-md border border-ink/25 text-ink bg-white text-center text-sm font-bold hover:bg-paper-2 transition"
                >
                  Sepete Git
                </Link>
                <Link
                  href="/odeme"
                  onClick={() => setIsCartOpen(false)}
                  className="py-3 px-4 rounded-md bg-yellow-500 text-ink text-center text-sm font-display font-bold uppercase hover:bg-yellow-400 transition flex items-center justify-center gap-1.5"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-ink-soft pt-1 font-mono">
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

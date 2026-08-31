'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, totalPrice, clearCart } = useCart()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'İstanbul',
    district: '',
    address: '',
    notes: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [paytrIframeUrl, setPaytrIframeUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const freeShippingThreshold = 500
  const shippingFee = totalPrice >= freeShippingThreshold ? 0 : 90
  const grandTotal = totalPrice + shippingFee

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setErrorMessage('Lütfen tüm zorunlu alanları doldurunuz.')
      return
    }

    if (cart.length === 0) {
      setErrorMessage('Sepetiniz boş.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout/paytr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalAmount: grandTotal,
          shippingCost: shippingFee,
        }),
      })

      const data = await response.json()
      if (response.ok && data.iframe_token) {
        setPaytrIframeUrl(`https://www.paytr.com/odeme/guvenli/${data.iframe_token}`)
      } else if (data.orderNumber) {
        // Direct test order success
        clearCart()
        router.push(`/odeme/basarili?orderNumber=${data.orderNumber}`)
      } else {
        setErrorMessage(data.error || 'Ödeme başlatılamadı. Lütfen bilgilerinizi kontrol edin.')
      }
    } catch (err: any) {
      setErrorMessage('Bağlantı hatası oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  if (cart.length === 0 && !paytrIframeUrl) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Sepetiniz Boş</h1>
        <p className="text-sm text-slate-500 mb-6">Ödeme yapmak için sepetinize ürün eklemelisiniz.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl"
        >
          <span>Ürünlere Göz At</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/sepet" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sepete Geri Dön</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Güvenli Ödeme & Sipariş</h1>
        <p className="text-xs text-slate-500 mt-1">256-Bit SSL sertifikasıyla güvenli sipariş tamamlama</p>
      </div>

      {paytrIframeUrl ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>PayTR 3D Secure Güvenli Ödeme Ekranı</span>
          </h2>
          <iframe
            src={paytrIframeUrl}
            className="w-full h-[650px] border-0 rounded-2xl"
            title="PayTR Ödeme"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="w-5 h-5 text-blue-600" />
                <span>1. İletişim & Fatura Bilgileri</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Adınız ve Soyadınız"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefon Numarası *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05XX XXX XX XX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    E-Posta Adresi (Sipariş Takibi İçin) *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>2. Teslimat Adresi</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Şehir *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Şehir"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İlçe *</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="İlçe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Açık Adres (Mahalle, Cadde, Sokak, Kapı No) *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Kargonuzun teslim edileceği tam adres..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sipariş Notu (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Kurye için özel teslimat notunuz"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                Sipariş Detayı
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-12 h-12 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={item.image || 'https://placehold.co/400x400/1e293b/ffffff?text=MPM'}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 truncate">{item.title}</p>
                        <span className="text-[11px] text-slate-500">Adet: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-bold text-slate-800">{formatPrice(totalPrice)}</span>
                </div>
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
                  <span>Toplam Ödenecek</span>
                  <span className="text-blue-600 text-xl">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-extrabold transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Ödeme Hazırlanıyor...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Güvenli Ödemeye Geç</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PayTR 3D Secure ile Korumalı Ödeme</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

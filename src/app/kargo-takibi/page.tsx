'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

function TrackingContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '')
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!orderNumber.trim()) return

    setIsLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`)
      const data = await res.json()
      if (res.ok && data.order) {
        setOrder(data.order)
      } else {
        setError(data.error || 'Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.')
      }
    } catch (err) {
      setError('Sorgulama sırasında bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchParams.get('orderNumber')) {
      handleSearch()
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Kargo & Sipariş Takibi</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sipariş numaranızı yazarak siparişinizin güncel durumunu anlık olarak takip edebilirsiniz.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
            placeholder="Örn: MPM-12345678"
            className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !orderNumber.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-2xl transition shadow-md flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Sorgula</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-semibold text-center flex items-center justify-center gap-2 mb-8">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[11px] text-slate-400 font-bold block">Sipariş Numarası</span>
              <span className="text-xl font-mono font-black text-slate-900">{order.orderNumber}</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 font-bold block">Sipariş Durumu</span>
              <span className="inline-block mt-0.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                {order.status === 'pending'
                  ? 'Sipariş Alındı'
                  : order.status === 'processing'
                  ? 'Hazırlanıyor'
                  : order.status === 'shipped'
                  ? 'Kargoya Verildi'
                  : order.status === 'delivered'
                  ? 'Teslim Edildi'
                  : 'İptal Edildi'}
              </span>
            </div>
          </div>

          {/* Tracking info if shipped */}
          {order.trackingNumber && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  Kargo Firması: {order.shippingCompany || 'Yurtiçi Kargo'}
                </span>
                <span className="text-xs font-mono text-emerald-700">
                  Takip No: {order.trackingNumber}
                </span>
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Sipariş Edilen Ürünler
            </h3>
            <div className="space-y-2">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <span className="font-semibold text-slate-800">{item.product?.title || 'Ürün'}</span>
                  <div className="text-right">
                    <span className="text-slate-500 mr-3">{item.quantity} Adet</span>
                    <span className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
            <span>Toplam Tutar:</span>
            <span className="text-blue-600 text-base">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Yükleniyor...</div>}>
      <TrackingContent />
    </Suspense>
  )
}

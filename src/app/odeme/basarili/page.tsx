'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, ArrowRight, Package, Home } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber') || 'MPM-123456'

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
        Ödeme Başarılı
      </span>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">
        Siparişiniz Alındı!
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
        Siparişiniz başarıyla oluşturuldu ve hazırlık sırasına alındı. Saat 16:30 öncesi siparişler aynı gün kargoya teslim edilir.
      </p>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-8 inline-block text-left w-full max-w-sm">
        <span className="text-[11px] text-slate-400 block font-semibold">Sipariş Numaranız</span>
        <span className="text-lg font-mono font-black text-blue-600">{orderNumber}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/kargo-takibi?orderNumber=${orderNumber}`}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
        >
          <Package className="w-4 h-4" />
          <span>Siparişi Takip Et</span>
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Yükleniyor...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

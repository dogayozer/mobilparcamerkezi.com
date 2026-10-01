'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { XCircle, ArrowRight, Home, MessageCircle } from 'lucide-react'
import PaymentReturn from '@/components/PaymentReturn'

function FailContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('orderNumber')

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <PaymentReturn />
      <div className="w-20 h-20 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20">
        <XCircle className="w-10 h-10" />
      </div>
      <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
        Ödeme Tamamlanamadı
      </span>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">Ödemeniz Onaylanmadı</h1>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
        Kartınızdan para çekilmedi. Kart bilgilerinizi, limitinizi ve internet alışverişine açık olduğunu kontrol edip
        tekrar deneyebilir; 3D Secure doğrulamasında gelen SMS kodunu girmeniz gerekir. Sepetiniz korunuyor.
      </p>

      {orderNumber && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-8 inline-block text-left w-full max-w-sm">
          <span className="text-[11px] text-slate-400 block font-semibold">Deneme Numarası</span>
          <span className="text-sm font-mono font-black text-slate-700">{orderNumber}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/sepet"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1.5"
        >
          <span>Sepete Dön ve Tekrar Dene</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Ana Sayfaya Dön</span>
        </Link>
      </div>

      <p className="text-[11px] text-slate-400 mt-8 flex items-center justify-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5" />
        Sorun devam ederse WhatsApp veya telefonla sipariş verebilirsiniz.
      </p>
    </div>
  )
}

export default function OrderFailPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs">Yükleniyor...</div>}>
      <FailContent />
    </Suspense>
  )
}

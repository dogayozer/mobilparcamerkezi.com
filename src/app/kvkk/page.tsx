import React from 'react'
import { Shield } from 'lucide-react'
import { getStoreSettings } from '@/lib/data'

export const revalidate = 60

export default async function KvkkPage() {
  const settings = await getStoreSettings()
  const htmlContent = settings?.kisiselVerilerHtml

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center mx-auto">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">KVKK Aydınlatma Metni</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {htmlContent ? (
          <div
            className="prose prose-slate prose-sm max-w-none [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: htmlContent.replace(/\n/g, '<br/>') }}
          />
        ) : (
          <>
            <h3 className="text-base font-black text-slate-900">1. Veri Sorumlusu</h3>
            <p>
              Mobil Parça Merkezi olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca kişisel verilerinizi mevzuata uygun olarak işlemekte ve korumaktayız.
            </p>
            <h3 className="text-base font-black text-slate-900">2. Kişisel Verilerin İşlenme Amacı</h3>
            <p>
              Toplanan kişisel verileriniz (ad, soyad, telefon, adres, e-posta), siparişlerinizin işlenmesi, faturalandırılması, kargo şirketlerine teslimi ve müşteri hizmetleri desteği sağlanması amaçlarıyla işlenmektedir.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

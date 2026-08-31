import React from 'react'
import { FileText } from 'lucide-react'

export default function DistanceSellingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Mesafeli Satış Sözleşmesi</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          6502 Sayılı Tüketicinin Korunması Hakkında Kanun Kapsamında Düzenlenmiştir
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-black text-slate-900">Madde 1: Taraflar</h3>
        <p>
          <strong>SATICI:</strong> Mobil Parça Merkezi<br />
          <strong>ALICI:</strong> www.mobilparcamerkezi.com internet sitesinden sipariş veren gerçek/tüzel kişi.
        </p>

        <h3 className="text-base font-black text-slate-900">Madde 2: Sözleşmenin Konusu</h3>
        <p>
          İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait internet sitesinden elektronik ortamda siparişini yaptığı, sitede belirtilen niteliklere sahip ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
        </p>

        <h3 className="text-base font-black text-slate-900">Madde 3: Teslimat ve İade</h3>
        <p>
          Ürün, ALICI'nın belirttiği teslimat adresine anlaşmalı kargo firması aracılığı ile taahhüt edilen süre içerisinde teslim edilir. ALICI, ürünü teslim aldığı andan itibaren 14 gün içinde cayma hakkına sahiptir.
        </p>
      </div>
    </div>
  )
}

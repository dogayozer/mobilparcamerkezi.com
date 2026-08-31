import React from 'react'
import { RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function ReturnAndWarrantyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mx-auto">
          <RotateCcw className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">İade & Garanti Şartları</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          14 Gün Koşulsuz İade ve Birebir Değişim Güvencesi
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-black text-slate-900">1. Cayma Hakkı ve İade Koşulları</h3>
        <p>
          Satın aldığınız ürünleri teslim aldığınız tarihten itibaren 14 (on dört) gün içerisinde herhangi bir gerekçe göstermeksizin iade edebilir veya değiştirebilirsiniz. İade edilecek ürünlerin orijinal ambalajında, koruyucu jelatinleri sökülmemiş ve montajı yapılmamış olması gerekmektedir.
        </p>

        <h3 className="text-base font-black text-slate-900">2. Garanti Kapsamı</h3>
        <p>
          Mobil Parça Merkezi'nden satın alınan tüm batarya, adaptör ve elektronik donanım parçaları 6 ay birebir değişim garantisi kapsamındadır. Cihaza montaj esnasında oluşan kullanıcı kaynaklı flex yırtılmaları, sıvı teması veya kırılmalar garanti haricindedir.
        </p>

        <h3 className="text-base font-black text-slate-900">3. İade Süreci Nasıl İşler?</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>WhatsApp destek hattımızdan (+90 500 000 00 00) veya e-posta ile iade talebi oluşturun.</li>
          <li>Size iletilecek anlaşmalı kargo kodu ile ürünü faturasıyla birlikte ücretsiz kargolayın.</li>
          <li>Depomuza ulaşan ürün 2 iş günü içerisinde incelenir ve ücret iadeniz bankanıza aktarılır.</li>
        </ol>
      </div>
    </div>
  )
}

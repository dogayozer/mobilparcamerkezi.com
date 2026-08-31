import React from 'react'
import { Smartphone, ShieldCheck, Truck, Headphones, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
          <Smartphone className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Hakkımızda</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Türkiye'nin Lider Telefon Yedek Parça ve Aksesuar Çözüm Merkezi
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>
          <strong>Mobil Parça Merkezi</strong>, Türkiye genelinde bireysel kullanıcılardan profesyonel teknik servislere kadar binlerce müşteriye yüksek standartta telefon yedek parçası, batarya, kasa, ekran ve şarj aksesuarları temin etmek amacıyla kurulmuştur.
        </p>

        <h3 className="text-base font-black text-slate-900 pt-2">Misyonumuz</h3>
        <p>
          Müşterilerimize güvenilir, %100 test edilmiş ve cihazlarıyla kusursuz uyum sağlayan yedek parçaları en uygun fiyat ve aynı gün kargo süratiyle ulaştırmaktır.
        </p>

        <h3 className="text-base font-black text-slate-900 pt-2">Neden Biz?</h3>
        <ul className="space-y-2.5">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span><strong>Uzman Test Süreci:</strong> Tüm batarya ve donanım parçaları depomuza girmeden önce teknik testlerden geçer.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span><strong>Aynı Gün Kargo:</strong> Saat 16:30'a kadar verilen tüm siparişler aynı iş günü kargolanır.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span><strong>Şeffaf ve Güvenli Alışveriş:</strong> PayTR 3D Secure güvencesiyle 256-bit SSL korumalı ödeme.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

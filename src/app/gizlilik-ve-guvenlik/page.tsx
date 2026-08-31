import React from 'react'
import { Lock, ShieldCheck } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Gizlilik ve Güvenlik Politikası</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Verilerinizin ve Ödeme Güvenliğinizin Korunması
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="text-base font-black text-slate-900">Kredi Kartı Güvenliği</h3>
        <p>
          Mobil Parça Merkezi web sitemiz üzerinden yapılan ödemelerde 256-bit SSL güvenlik sertifikası ve PayTR 3D Secure altyapısı kullanılmaktadır. Kredi kartı bilgileriniz kesinlikle sunucularımızda saklanmaz ve doğrudan bankanın güvenli ödeme ekranına iletilir.
        </p>

        <h3 className="text-base font-black text-slate-900">Kişisel Bilgilerin Korunması</h3>
        <p>
          Üyelik ve sipariş sırasında ilettiğiniz ad, adres, telefon ve e-posta gibi bilgiler sadece siparişinizin kargolanması ve bilgilendirme süreçlerinde kullanılır. Üçüncü şahıs veya kurumlarla paylaşılmaz.
        </p>
      </div>
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Truck, RotateCcw, Headphones, CreditCard, Lock, Mail, Phone, MapPin } from 'lucide-react'

function BrandMark({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 20V6h4l4 7 4-7h4v14"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Footer({ settings }: { settings?: any }) {
  return (
    <footer className="bg-ink-900 text-[#9a9282] text-sm mt-20">
      <div className="hazard-stripe" />
      {/* Top Features Banner */}
      <div className="border-b border-yellow-500/10 bg-white/[0.02] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-md bg-white/[0.03] border border-yellow-500/10">
            <div className="w-12 h-12 rounded-md bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/25">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Aynı Gün Hızlı Kargo</h4>
              <p className="text-xs mt-0.5">Saat 16:30'a kadar verilen siparişler</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-md bg-white/[0.03] border border-yellow-500/10">
            <div className="w-12 h-12 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">%100 Test Edilmiş & Uyumlu</h4>
              <p className="text-xs mt-0.5">Sıfır hata ile çalışan parçalar</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-md bg-white/[0.03] border border-yellow-500/10">
            <div className="w-12 h-12 rounded-md bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/25">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Kolay İade & Değişim</h4>
              <p className="text-xs mt-0.5">14 gün koşulsuz iade hakkı</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-md bg-white/[0.03] border border-yellow-500/10">
            <div className="w-12 h-12 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Canlı Teknik Destek</h4>
              <p className="text-xs mt-0.5">Model uyumluluğu için WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-yellow-500 flex items-center justify-center text-ink font-bold">
                <BrandMark className="w-5 h-5" />
              </div>
              <span className="text-lg font-display font-extrabold uppercase tracking-tight">
                <span className="text-white">MOBİLPARÇA</span>
                <span className="text-yellow-500">MERKEZİ</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Sirkeci, İstanbul merkezli telefon yedek parça, batarya, kasa, şarj aletleri ve aksesuar toptancısı. Barkod bazlı stok takibiyle, kaliteli ve test edilmiş ürünlerle cihazınızı ilk günkü performansına kavuşturun.
            </p>
            <div className="pt-2 space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                <span>{settings?.address || 'Sirkeci, Fatih / İstanbul'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{settings?.phone || '0544 577 42 57'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span>{settings?.email || 'destek@mobilparcamerkezi.com'}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-500 mb-4">
              Kategoriler
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/kategori/batarya" className="hover:text-white transition">Telefon Bataryaları</Link></li>
              <li><Link href="/kategori/kasa" className="hover:text-white transition">Kasa & Arka Kapaklar</Link></li>
              <li><Link href="/kategori/sarj-aleti" className="hover:text-white transition">Şarj Aletleri & Adaptörler</Link></li>
              <li><Link href="/kategori/sarj-kablosu" className="hover:text-white transition">Hızlı Şarj Kabloları</Link></li>
              <li><Link href="/kategori/tus-takimi" className="hover:text-white transition">Tuş Takımı & Flex Kablolar</Link></li>
              <li><Link href="/kategori/koruyucu" className="hover:text-white transition">Ekran Koruyucu Camlar</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-500 mb-4">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/kargo-takibi" className="hover:text-white transition">Kargo Takip</Link></li>
              <li><Link href="/hesabim" className="hover:text-white transition">Hesabım & Siparişlerim</Link></li>
              <li><Link href="/iade-ve-garanti" className="hover:text-white transition">İade ve Garanti Şartları</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-white transition">Hakkımızda</Link></li>
              <li><Link href="/admin" className="hover:text-yellow-500 transition text-[#5c5548]">Yönetici Girişi</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-500 mb-4">
              Kurumsal & Hukuki
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/mesafeli-satis-sozlesmesi" className="hover:text-white transition">Mesafeli Satış Sözleşmesi</Link></li>
              <li><Link href="/gizlilik-ve-guvenlik" className="hover:text-white transition">Gizlilik ve Güvenlik Politikası</Link></li>
              <li><Link href="/kvkk" className="hover:text-white transition">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/iade-ve-garanti" className="hover:text-white transition">İptal & İade Prosedürü</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Security & Copyright */}
      <div className="border-t border-yellow-500/10 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5c5548]">
          <div>© {new Date().getFullYear()} MOBİLPARÇAMERKEZİ.COM · SİRKECİ / İSTANBUL</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-md border border-yellow-500/10">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-[11px] text-white">256-Bit SSL Secured</span>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.03] px-3 py-1.5 rounded-md border border-yellow-500/10">
              <CreditCard className="w-3.5 h-3.5 text-yellow-500" />
              <span className="font-semibold text-[11px] text-white">PayTR 3D Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { BUSINESS_TYPES } from '@/lib/accountTypes'

const STORAGE_KEY = 'dealerSplash'
const DISMISS_DAYS = 7
// Alışveriş/ödeme ve üyelik akışını bölmemek için bu sayfalarda gösterilmez
const HIDDEN_PREFIXES = ['/admin', '/odeme', '/sepet', '/kayit-ol', '/giris']

export default function DealerSplash() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', businessType: '', marketingConsent: false })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const hidden = HIDDEN_PREFIXES.some((prefix) => pathname?.startsWith(prefix))

  useEffect(() => {
    if (hidden) return
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
      if (saved?.status === 'subscribed') return
      if (saved?.status === 'dismissed' && Date.now() - saved.at < DISMISS_DAYS * 24 * 60 * 60 * 1000) return
    } catch {}
    const timer = setTimeout(() => setOpen(true), 3000)
    return () => clearTimeout(timer)
  }, [hidden])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const remember = (value: object) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {}
  }

  const close = () => {
    if (status !== 'done') remember({ status: 'dismissed', at: Date.now() })
    setOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('sending')
    try {
      const res = await fetch('/api/dealer-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Kayıt yapılamadı.')
      remember({ status: 'subscribed' })
      setStatus('done')
    } catch (err: any) {
      setError(err.message || 'Bağlantı hatası oluştu.')
      setStatus('idle')
    }
  }

  if (!open || hidden) return null

  const inputClass =
    'w-full bg-paper-2 border border-ink/15 rounded-md px-3.5 py-2.5 text-sm text-ink focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dealer-splash-title"
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-paper border-[3px] border-ink rounded-md shadow-2xl"
      >
        <div className="bg-ink text-white px-6 pt-6 pb-5">
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute top-3 right-3 p-1.5 rounded-md text-[#8a8272] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-yellow-500 mb-1">
            Yakında
          </span>
          <h2 id="dealer-splash-title" className="text-xl font-display font-extrabold uppercase pr-8 leading-tight">
            Bayi portalımız yakında hizmetinizde!
          </h2>
          <p className="text-sm text-[#cfc7b6] mt-2">
            Bayi fiyatları ve kısa süreli kampanyalar için bültenimize üye olun.
          </p>
        </div>
        <div className="hazard-stripe" />

        {status === 'done' ? (
          <div className="px-6 py-8 text-center">
            <p className="text-lg font-display font-extrabold text-ink uppercase">Teşekkürler!</p>
            <p className="text-sm text-ink-soft mt-1">Bayi portalımız açıldığında sizi ilk biz haberdar edeceğiz.</p>
            <button
              type="button"
              onClick={close}
              className="mt-6 w-full py-3 bg-ink text-yellow-500 rounded-md text-sm font-display font-bold uppercase hover:bg-ink-900 transition"
            >
              Kapat
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
            <input
              type="tel"
              required
              placeholder="Telefon * (05XX XXX XX XX)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
            />
            <input
              type="email"
              placeholder="E-posta"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            <select
              value={form.businessType}
              onChange={(e) => setForm({ ...form, businessType: e.target.value })}
              className={inputClass}
            >
              <option value="">İşletme türü</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.marketingConsent}
                onChange={(e) => setForm({ ...form, marketingConsent: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-ink/30 accent-yellow-500"
              />
              <span className="text-xs text-ink-soft leading-relaxed">
                Bayi fiyatları ve kampanyalar hakkında SMS / e-posta ile bilgilendirilmeyi kabul ediyorum.{' '}
                <Link href="/kvkk" target="_blank" className="text-ink font-semibold underline">
                  KVKK Aydınlatma Metni
                </Link>
              </span>
            </label>

            {error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2.5">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={close}
                className="py-3 bg-paper-2 border border-ink/15 text-ink rounded-md text-sm font-display font-bold uppercase hover:bg-white transition"
              >
                Kapat
              </button>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="py-3 bg-yellow-500 hover:bg-yellow-400 text-ink rounded-md text-sm font-display font-extrabold uppercase transition disabled:opacity-50"
              >
                {status === 'sending' ? 'Gönderiliyor...' : 'Üye Ol'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

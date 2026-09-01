'use client'

import React, { useState } from 'react'
import { Settings, Save, CheckCircle2 } from 'lucide-react'

export default function SettingsForm({ settings }: { settings: any }) {
  const [formData, setFormData] = useState({
    companyName: settings?.companyName || 'Mobil Parça Merkezi',
    address: settings?.address || 'İstanbul, Türkiye',
    phone: settings?.phone || '0544 577 42 57',
    whatsappPhone: settings?.whatsappPhone || '905445774257',
    shippingThreshold: settings?.shippingThreshold || 500,
    shippingFee: settings?.shippingFee || 90,
    sameDayShippingTime: settings?.sameDayShippingTime || '16:30',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          <span>Mağaza & Kargo Ayarları</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">İletişim, WhatsApp ve Kargo parametrelerini güncelleyin</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Ayarlar başarıyla kaydedildi!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Mağaza Adı</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Telefon Numarası</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">WhatsApp Destek Hattı</label>
            <input
              type="text"
              value={formData.whatsappPhone}
              onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Ücretsiz Kargo Limiti (TL)</label>
            <input
              type="number"
              value={formData.shippingThreshold}
              onChange={(e) => setFormData({ ...formData, shippingThreshold: parseFloat(e.target.value) })}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">Sabit Kargo Ücreti (TL)</label>
            <input
              type="number"
              value={formData.shippingFee}
              onChange={(e) => setFormData({ ...formData, shippingFee: parseFloat(e.target.value) })}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-bold mb-1">Aynı Gün Kargo Saati</label>
            <input
              type="text"
              value={formData.sameDayShippingTime}
              onChange={(e) => setFormData({ ...formData, sameDayShippingTime: e.target.value })}
              className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Adres Bilgisi</label>
          <textarea
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-600/30"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
        </button>
      </form>
    </div>
  )
}

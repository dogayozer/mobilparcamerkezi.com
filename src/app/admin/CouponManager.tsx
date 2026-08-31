'use client'

import React, { useState, useEffect } from 'react'
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react'

export default function CouponManager() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [code, setCode] = useState('')
  const [type, setType] = useState('percentage')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons')
      const data = await res.json()
      if (res.ok) setCoupons(data.coupons || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || !value) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase(),
          type,
          value: parseFloat(value),
        }),
      })

      if (res.ok) {
        setCode('')
        setValue('')
        fetchCoupons()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-400" />
          <span>İndirim Kuponları</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Müşterileriniz için indirim kodları oluşturun</p>
      </div>

      <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-700">
        <div>
          <input
            type="text"
            required
            placeholder="Kupon Kodu (Örn: MPM10)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono"
          />
        </div>
        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="percentage">Yüzde (%) İndirim</option>
            <option value="fixed">Sabit TL İndirimi</option>
          </select>
        </div>
        <div>
          <input
            type="number"
            required
            placeholder="Değer (Örn: 10 veya 50)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Kupon Oluştur</span>
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-bold">
              <th className="pb-3">Kupon Kodu</th>
              <th className="pb-3">Tür</th>
              <th className="pb-3">Değer</th>
              <th className="pb-3 text-right">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-700/30">
                <td className="py-3 font-mono font-bold text-amber-400">{c.code}</td>
                <td className="py-3 text-slate-300">{c.type === 'percentage' ? 'Yüzde' : 'Sabit'}</td>
                <td className="py-3 font-bold text-white">
                  {c.type === 'percentage' ? `%${c.value}` : `${c.value} TL`}
                </td>
                <td className="py-3 text-right text-emerald-400 font-semibold">Aktif</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

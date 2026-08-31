'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layers, Plus, Trash2, Edit2, Check } from 'lucide-react'

export default function CategoryManager({ categories }: { categories: any[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [templateType, setTemplateType] = useState('generic')
  const [loading, setLoading] = useState(false)

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, template_type: templateType }),
      })

      if (res.ok) {
        setName('')
        setSlug('')
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Kategori Yönetimi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Mevcut kategorileri düzenleyin veya yenisini ekleyin</p>
        </div>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-850 p-4 rounded-2xl border border-slate-700">
        <div>
          <input
            type="text"
            required
            placeholder="Kategori Adı"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <input
            type="text"
            required
            placeholder="Slug / URL"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
          />
        </div>
        <div>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="generic">Genel</option>
            <option value="battery">Batarya</option>
            <option value="case">Kasa / Kapak</option>
            <option value="charger">Şarj Aleti</option>
            <option value="cable">Şarj Kablosu</option>
            <option value="keypad">Tuş Takımı</option>
            <option value="protector">Ekran Koruyucu</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Kategori Ekle</span>
          </button>
        </div>
      </form>

      {/* Category List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 font-bold">
              <th className="pb-3">Kategori Adı</th>
              <th className="pb-3">Slug</th>
              <th className="pb-3">Şablon Türü</th>
              <th className="pb-3 text-right">Ürün Sayısı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-700/30">
                <td className="py-3 font-semibold text-white">{cat.name}</td>
                <td className="py-3 font-mono text-slate-400">{cat.slug}</td>
                <td className="py-3 text-slate-300 capitalize">{cat.template_type}</td>
                <td className="py-3 text-right font-bold text-blue-400">
                  {cat._count?.products || 0} Ürün
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

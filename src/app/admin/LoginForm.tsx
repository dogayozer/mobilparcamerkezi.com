'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Smartphone, ArrowRight } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        setError('Geçersiz yönetici şifresi.')
      }
    } catch (err) {
      setError('Bağlantı hatası oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl text-white space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight">MPM Yönetim Paneli</h1>
          <p className="text-xs text-slate-400">Yönetici şifrenizi giriniz</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Şifre</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yönetici Şifresi"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
          >
            <span>{loading ? 'Giriş Yapılıyor...' : 'Panele Giriş'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

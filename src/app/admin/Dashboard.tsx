'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import {
  Package,
  ShoppingBag,
  Users,
  Settings,
  Tag,
  Layers,
  LogOut,
  AlertCircle,
  FileSpreadsheet,
  Truck
} from 'lucide-react'
import CategoryManager from './CategoryManager'
import CouponManager from './CouponManager'
import SettingsForm from './SettingsForm'

interface DashboardProps {
  stats: {
    productCount: number
    orderCount: number
    customerCount: number
  }
  recentOrders: any[]
  categories: any[]
  settings: any
}

export default function Dashboard({ stats, recentOrders, categories, settings }: DashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'excel' | 'orders' | 'categories' | 'coupons' | 'settings'>('overview')

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            MPM
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white">
              Mobil Parça Merkezi - Yönetici Paneli
            </h1>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sistem Aktif & Güvenli
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
          >
            Siteyi Gör ↗
          </a>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl transition flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-slate-950/60 border-b border-slate-800 px-6">
        <div className="flex gap-2 overflow-x-auto py-2">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: Package },
            { id: 'excel', label: 'Excel ile Ürün Yükleme', icon: FileSpreadsheet },
            { id: 'orders', label: 'Siparişler', icon: ShoppingBag },
            { id: 'categories', label: 'Kategoriler', icon: Layers },
            { id: 'coupons', label: 'Kuponlar', icon: Tag },
            { id: 'settings', label: 'Mağaza Ayarları', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Toplam Ürün</span>
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white">{stats.productCount}</div>
                <span className="text-xs text-slate-400">Aktif ve stoktaki ürünler</span>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Toplam Sipariş</span>
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white">{stats.orderCount}</div>
                <span className="text-xs text-slate-400">Tüm verilen siparişler</span>
              </div>

              <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Kayıtlı Müşteriler</span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-3xl font-black text-white">{stats.customerCount}</div>
                <span className="text-xs text-slate-400">Kayıtlı ve misafir kullanıcılar</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" />
                <span>Son Gelen Siparişler</span>
              </h2>

              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Henüz gelen sipariş bulunmuyor.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 font-bold">
                        <th className="pb-3">Sipariş No</th>
                        <th className="pb-3">Müşteri</th>
                        <th className="pb-3">Tarih</th>
                        <th className="pb-3">Durum</th>
                        <th className="pb-3 text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-700/30">
                          <td className="py-3 font-mono font-bold text-blue-400">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 font-semibold text-slate-200">
                            {ord.customer?.name || ord.customer?.email || 'Misafir'}
                          </td>
                          <td className="py-3 text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 font-bold uppercase text-[10px]">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-white">
                            {formatPrice(ord.totalAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXCEL UPLOAD TAB — artık merkezi Fodos admin panelinden yapılıyor */}
        {activeTab === 'excel' && (
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              <span>Ürün / Stok / Fiyat Yönetimi Taşındı</span>
            </h2>
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Mobil Parça Merkezi artık Fodos ile <strong>ortak/paylaşılan bir veritabanı</strong> kullanıyor.
                Bu yüzden ürün, stok ve fiyat güncellemeleri (Excel yükleme dahil) SADECE Fodos'un merkezi admin
                panelinden yapılmalı — buradan yapılacak bir yükleme Fodos'un canlı verilerini de etkiler/ezer,
                bu yüzden devre dışı bırakıldı. MPM'e özel satış fiyatları, Fodos admin panelindeki "Toplu Fiyat
                Güncelleme" bölümünden marka seçilerek ayarlanır.
              </span>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && <CategoryManager categories={categories} />}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && <CouponManager />}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && <SettingsForm settings={settings} />}
      </main>
    </div>
  )
}

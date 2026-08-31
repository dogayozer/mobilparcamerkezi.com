import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { User, Package, MapPin, LogOut, ShoppingBag } from 'lucide-react'

export const revalidate = 0

export default async function AccountPage() {
  const session = await getSession()

  if (!session) {
    redirect('/giris')
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.userId },
    include: {
      // Fodos ile ortak veritabanı kullanıldığından, müşteri Fodos'ta da sipariş vermiş olabilir —
      // burada sadece MPM üzerinden verilen siparişler gösterilir.
      orders: {
        where: { store: 'mpm' },
        include: {
          items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!customer) {
    redirect('/giris')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Hesabım</h1>
          <p className="text-xs text-slate-500 mt-1">Hoş geldiniz, {customer.name || customer.email}</p>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Info Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                {customer.name ? customer.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{customer.name || 'Misafir'}</h3>
                <p className="text-xs text-slate-500">{customer.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Telefon:</span>
                <span className="font-semibold text-slate-800">{customer.phone || 'Belirtilmemiş'}</span>
              </div>
              <div className="flex justify-between">
                <span>Şehir / İlçe:</span>
                <span className="font-semibold text-slate-800">
                  {customer.city ? `${customer.city} / ${customer.district || ''}` : 'Belirtilmemiş'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kayıt Tarihi:</span>
                <span className="font-semibold text-slate-800">
                  {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order History (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Sipariş Geçmişim ({customer.orders.length})</span>
            </h2>

            {customer.orders.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">Henüz siparişiniz bulunmuyor.</p>
                <Link
                  href="/"
                  className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Alışverişe Başla
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customer.orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {new Date(ord.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-[11px] font-bold uppercase">
                          {ord.status}
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {formatPrice(ord.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      {ord.items.map((it: any) => (
                        <div key={it.id} className="flex justify-between">
                          <span className="truncate max-w-sm">{it.product?.title || 'Ürün'}</span>
                          <span>{it.quantity} x {formatPrice(it.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

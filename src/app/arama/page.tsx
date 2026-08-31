import React from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { Search, ChevronRight, Smartphone } from 'lucide-react'
import { withMpmPrice } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const revalidate = 0

export default async function SearchPage({ searchParams }: Props) {
  const sParams = await searchParams
  const query = typeof sParams.q === 'string' ? sParams.q.trim() : ''

  let products: any[] = []

  if (query) {
    const terms = query
      .toLowerCase()
      .split(' ')
      .filter((t) => t.length > 0)

    products = (
      await prisma.product.findMany({
        where: {
          status: { not: 'inactive' },
          AND: terms.map((term) => ({
            OR: [
              { title: { contains: term, mode: 'insensitive' as const } },
              { description_raw: { contains: term, mode: 'insensitive' as const } },
              { brand: { contains: term, mode: 'insensitive' as const } },
              { model_code: { contains: term, mode: 'insensitive' as const } },
              { barcode: { contains: term, mode: 'insensitive' as const } },
            ],
          })),
        },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          category: { select: { name: true, slug: true } },
        },
        orderBy: { stock_qty: 'desc' },
        take: 60,
      })
    ).map(withMpmPrice)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition">
          Ana Sayfa
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800">Arama Sonuçları</span>
      </nav>

      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Search className="w-4 h-4" />
              <span>ARAMA SONUÇLARI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {query ? `"${query}" için sonuçlar` : 'Tüm Ürünler'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Bulunan toplam <strong>{products.length}</strong> adet ürün listeleniyor.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Sonuç Bulunamadı</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            "{query}" aramasıyla eşleşen ürün bulunamadı. Lütfen kelimeleri kontrol edin veya model adı yazın.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
            {['iPhone 11', 'Samsung A50', 'Redmi Note 8', 'Batarya', 'Kasa', 'Şarj Kablosu'].map(
              (sug) => (
                <Link
                  key={sug}
                  href={`/arama?q=${encodeURIComponent(sug)}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  {sug}
                </Link>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

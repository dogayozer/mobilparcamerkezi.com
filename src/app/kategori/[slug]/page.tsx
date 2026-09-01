import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ProductCard'
import { withMpmPrice } from '@/lib/utils'
import { ChevronRight, Filter, SlidersHorizontal, Smartphone } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const revalidate = 60

const MAX_TITLE = 60
const MAX_DESC = 155
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true } })

  if (!category) {
    return { title: 'Kategori Bulunamadı | Mobil Parça Merkezi' }
  }

  const pageTitle = `${category.name} | MPM`.length <= MAX_TITLE ? `${category.name} | MPM` : category.name.slice(0, MAX_TITLE - 1).trim() + '…'
  const desc = `${category.name} çeşitleri uygun fiyatlarla Mobil Parça Merkezi'nde. Garantili, test edilmiş yedek parçalar ve aynı gün kargo.`
  const pageDescription = desc.length > MAX_DESC ? desc.slice(0, MAX_DESC - 1).trim() + '…' : desc

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `${SITE_URL}/kategori/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sParams = await searchParams

  const category = await prisma.category.findUnique({
    where: { slug: slug },
  })

  if (!category) {
    // If not found by exact slug, check if slug is inside name
    const fallbackCategory = await prisma.category.findFirst({
      where: {
        slug: { contains: slug, mode: 'insensitive' },
      },
    })
    if (!fallbackCategory) {
      notFound()
    }
  }

  const activeCategory = category || (await prisma.category.findFirst({
    where: { slug: { contains: slug, mode: 'insensitive' } },
  }))

  if (!activeCategory) return notFound()

  // Filter params
  const selectedBrand = typeof sParams.brand === 'string' ? sParams.brand : undefined
  const sort = typeof sParams.sort === 'string' ? sParams.sort : 'newest'

  // MPM'in kendi fiyatına göre sırala (mpm_sale_price henüz hesaplanmamış ürünler sona düşer)
  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { mpm_sale_price: { sort: 'asc', nulls: 'last' } }
  if (sort === 'price_desc') orderBy = { mpm_sale_price: { sort: 'desc', nulls: 'last' } }
  if (sort === 'stock') orderBy = { stock_qty: 'desc' }

  const whereClause: any = {
    categoryId: activeCategory.id,
    status: { not: 'inactive' },
  }

  if (selectedBrand) {
    whereClause.brand = { equals: selectedBrand, mode: 'insensitive' }
  }

  const [rawProducts, brands] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      orderBy,
      take: 40,
    }),
    prisma.product.findMany({
      where: { categoryId: activeCategory.id, brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
    }),
  ])

  const products = rawProducts.map(withMpmPrice)

  const availableBrands = brands.map((b) => b.brand).filter(Boolean) as string[]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition">
          Ana Sayfa
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800">{activeCategory.name}</span>
      </nav>

      {/* Category Title & Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeCategory.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Toplam {products.length} adet uyumlu yedek parça ve model listeleniyor.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sırala:</span>
            <form method="GET" className="inline-block">
              {selectedBrand && <input type="hidden" name="brand" value={selectedBrand} />}
              <select
                name="sort"
                defaultValue={sort}
                className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="newest">En Yeniler</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="stock">Stok Durumu</option>
              </select>
            </form>
          </div>
        </div>

        {/* Brand Filter Pills */}
        {availableBrands.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Markaya Göre Filtrele
            </span>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/kategori/${activeCategory.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  !selectedBrand
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tümü
              </Link>
              {availableBrands.map((brand) => (
                <Link
                  key={brand}
                  href={`/kategori/${activeCategory.slug}?brand=${encodeURIComponent(brand)}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedBrand === brand
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Bu kategoride ürün bulunamadı</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Farklı bir filtre seçebilir veya tüm kategorilere göz atabilirsiniz.
          </p>
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

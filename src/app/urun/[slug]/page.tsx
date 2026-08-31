import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductDetailClient from './ProductDetailClient'
import ProductCard from '@/components/ProductCard'
import { ChevronRight } from 'lucide-react'
import { withMpmPrice } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      category: true,
    },
  })

  if (!product) {
    // Try fallback by barcode if slug contains barcode
    const parts = slug.split('-')
    const possibleBarcode = parts[parts.length - 1]
    const fallbackProduct = await prisma.product.findUnique({
      where: { barcode: possibleBarcode },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
    })
    if (!fallbackProduct) {
      notFound()
    }
  }

  const activeProduct = product || (await prisma.product.findFirst({
    where: { slug: { contains: slug } },
    include: { images: { orderBy: { order: 'asc' } }, category: true },
  }))

  if (!activeProduct) return notFound()

  const productWithMpmPrice = withMpmPrice(activeProduct)

  // Related products in the same category
  const relatedProducts = (
    await prisma.product.findMany({
      where: {
        categoryId: activeProduct.categoryId,
        id: { not: activeProduct.id },
        status: { not: 'inactive' },
      },
      include: {
        images: { orderBy: { order: 'asc' }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      take: 4,
    })
  ).map(withMpmPrice)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition">
          Ana Sayfa
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {activeProduct.category && (
          <>
            <Link
              href={`/kategori/${activeProduct.category.slug}`}
              className="hover:text-blue-600 transition"
            >
              {activeProduct.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="font-semibold text-slate-800 line-clamp-1 max-w-xs">
          {activeProduct.title}
        </span>
      </nav>

      {/* Main Product Layout */}
      <ProductDetailClient product={productWithMpmPrice} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
            Bu Ürünle Birlikte Bakılanlar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

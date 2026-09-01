import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

  let productUrls: any[] = []
  let categoryUrls: any[] = []

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: { not: 'inactive' } },
        select: { slug: true, updatedAt: true },
        take: 5000,
      }),
      // Sadece en az bir aktif ürünü olan kategoriler (boş/çöp kategorileri sitemap'e
      // sokup ince/boş içerik sinyali vermemek için)
      prisma.category.findMany({
        where: { products: { some: { status: { not: 'inactive' } } } },
        select: { slug: true, updatedAt: true },
      }),
    ])

    productUrls = products.map((p) => ({
      url: `${baseUrl}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    categoryUrls = categories.map((c) => ({
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch (e) {
    console.error('Error generating sitemap:', e)
  }

  const staticUrls = [
    '',
    '/hakkimizda',
    '/iade-ve-garanti',
    '/gizlilik-ve-guvenlik',
    '/mesafeli-satis-sozlesmesi',
    '/kvkk',
    '/kargo-takibi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }))

  return [...staticUrls, ...categoryUrls, ...productUrls]
}

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Revalidate olmadan bu route build/deploy anında donuyor: admin panelinden yapılan
// toplu ürün importları (kod deploy'u tetiklemiyor) sitemap'e hiç yansımıyordu. Saatte
// bir yenilenerek yeni ürünler bir sonraki deploy'u beklemeden Google'a görünür oluyor.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

  let productUrls: any[] = []
  let categoryUrls: any[] = []

  try {
    const [products, categories, categoryMaxUpdates] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'active' },
        select: { slug: true, updatedAt: true, has_real_photo: true },
        take: 50000, // sitemap limit — fodos-ecommerce ile aynı üst sınır, pratikte katalog boyutunun (14bin) çok üzerinde
      }),
      // Sadece en az bir aktif ürünü olan kategoriler (boş/çöp kategorileri sitemap'e
      // sokup ince/boş içerik sinyali vermemek için)
      prisma.category.findMany({
        where: { products: { some: { status: { not: 'inactive' } } } },
        select: { id: true, slug: true, updatedAt: true },
      }),
      // Kategori sayfasının lastModified'ı kategori satırının kendi meta verisinden
      // (nadiren değişir) değil, içindeki ürünlerin en son ne zaman güncellendiğinden
      // gelsin — Google'ın "bu sayfayı yeniden tara" kararı için gerçek bir sinyal.
      prisma.product.groupBy({
        by: ['categoryId'],
        where: { status: 'active', categoryId: { not: null } },
        _max: { updatedAt: true },
      }),
    ])

    const categoryLastModMap = new Map(
      categoryMaxUpdates.map((c) => [c.categoryId, c._max.updatedAt])
    )

    // Gerçek/benzersiz fotoğrafı olan ürünler biraz daha yüksek öncelikli — tarayıcı
    // önce kaliteli sayfalara odaklansın (priority Google için kesin bir sinyal değil,
    // ama zararsız ve doğru kaynağa ağırlık veriyor).
    productUrls = products.map((p) => ({
      url: `${baseUrl}/urun/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: p.has_real_photo ? 0.8 : 0.6,
    }))

    categoryUrls = categories.map((c) => ({
      url: `${baseUrl}/kategori/${c.slug}`,
      lastModified: categoryLastModMap.get(c.id) || c.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch (e) {
    console.error('Error generating sitemap:', e)
  }

  // Statik sayfalarda lastModified veriliyorsa Next her sitemap üretiminde "new Date()"
  // yazıp Google'a "bu sayfa az önce değişti" gibi yanlış bir tazelik sinyali gönderiyordu
  // (sayfa aslında değişmemiş olsa bile). Bu sayfaların gerçek değişim tarihini
  // izlemediğimiz için lastModified'ı hiç vermiyoruz — Google kendi taramasına göre karar versin.
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
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }))

  return [...staticUrls, ...categoryUrls, ...productUrls]
}

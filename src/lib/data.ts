import { prisma } from './prisma'
import { unstable_cache } from 'next/cache'

export const getStoreSettings = unstable_cache(
  async () => {
    try {
      let settings = await prisma.storeSettings.findUnique({
        where: { id: 'mpm' },
      })
      if (!settings) {
        settings = await prisma.storeSettings.create({
          data: {
            id: 'mpm',
            companyName: 'Mobil Parça Merkezi',
            address: 'İstanbul / Türkiye',
            phone: '0544 577 42 57',
            whatsappPhone: '905445774257',
            shippingThreshold: 500,
            shippingFee: 90,
            sameDayShippingTime: '16:30',
          },
        })
      }
      return settings
    } catch (e) {
      console.error('Error fetching store settings:', e)
      return {
        id: 'mpm',
        companyName: 'Mobil Parça Merkezi',
        address: 'İstanbul / Türkiye',
        phone: '0544 577 42 57',
        whatsappPhone: '905445774257',
        shippingThreshold: 500,
        shippingFee: 90,
        sameDayShippingTime: '16:30',
        aboutUs: null,
        mesafeliSatisHtml: null,
        gizlilikGuvenlikHtml: null,
        iptalIadeHtml: null,
        kargoTakipHtml: null,
        kisiselVerilerHtml: null,
        taxId: null,
        email: null,
        birfaturaApiKey: null,
        birfaturaKdvRate: 20,
        birfaturaAutoSync: true,
        updatedAt: new Date(),
      }
    }
  },
  ['store-settings'],
  { revalidate: 300, tags: ['settings'] }
)

export const getCategoryTree = unstable_cache(
  async () => {
    try {
      return await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { products: { where: { status: { not: 'inactive' } } } },
          },
        },
      })
    } catch (e) {
      console.error('Error fetching categories:', e)
      return []
    }
  },
  ['category-tree'],
  { revalidate: 300, tags: ['categories'] }
)

/* Header'daki hızlı erişim şeridi için gerçek ürün sayısına göre en popüler markalar */
export const getTopBrands = unstable_cache(
  async (limit: number = 8) => {
    try {
      const brands = await prisma.product.groupBy({
        by: ['brand'],
        where: { status: { not: 'inactive' }, brand: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: limit,
      })
      return brands
        .filter((b) => b.brand)
        .map((b) => ({ name: b.brand as string, count: b._count.id }))
    } catch (e) {
      console.error('Error fetching top brands:', e)
      return []
    }
  },
  ['top-brands'],
  { revalidate: 600, tags: ['products'] }
)

/* Kategori sayfası: kategori + ürün listesi + marka filtresi. Önceden kategori
   sayfasında doğrudan sorgulanıyordu (searchParams okuduğu için zaten dinamik
   render ediliyor, ama DB sorguları unstable_cache olmadan her istekte tekrar
   çalışıyordu) — fodos-ecommerce'deki getCachedCategoryData ile aynı desen. */
export const getCachedCategoryData = unstable_cache(
  async (slug: string, brand?: string, sort?: string) => {
    try {
      const category = await prisma.category.findUnique({ where: { slug } })
      const activeCategory =
        category ||
        (await prisma.category.findFirst({
          where: { slug: { contains: slug, mode: 'insensitive' } },
        }))

      if (!activeCategory) return null

      let orderBy: any = [{ has_real_photo: 'desc' }, { createdAt: 'desc' }]
      if (sort === 'price_asc') orderBy = { mpm_sale_price: { sort: 'asc', nulls: 'last' } }
      if (sort === 'price_desc') orderBy = { mpm_sale_price: { sort: 'desc', nulls: 'last' } }
      if (sort === 'stock') orderBy = { stock_qty: 'desc' }

      const whereClause: any = {
        categoryId: activeCategory.id,
        status: { not: 'inactive' },
      }
      if (brand) whereClause.brand = { equals: brand, mode: 'insensitive' }

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

      return { category: activeCategory, rawProducts, brands }
    } catch (e) {
      console.error('Error fetching category data:', e)
      return null
    }
  },
  ['mpm-category-products'],
  { revalidate: 300, tags: ['products'] }
)

export const getFeaturedBrands = unstable_cache(
  async () => {
    try {
      const brands = await prisma.product.findMany({
        where: { status: { not: 'inactive' }, brand: { not: null } },
        select: { brand: true },
        distinct: ['brand'],
        take: 12,
      })
      return brands.map((b) => b.brand).filter(Boolean) as string[]
    } catch (e) {
      return ['Apple iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Redmi', 'POCO', 'Realme']
    }
  },
  ['featured-brands'],
  { revalidate: 600, tags: ['products'] }
)

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
            phone: '0850 000 00 00',
            whatsappPhone: '905000000000',
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
        phone: '0850 000 00 00',
        whatsappPhone: '905000000000',
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

// ⚠️ ARTIK KULLANILMIYOR — mobilparcamerkezi artık Fodos ile AYNI ortak veritabanını
// kullanıyor (bkz. .env DATABASE_URL). Bu scripti ÇALIŞTIRMAYIN: FODOS_SOURCE_DB_URL
// artık tanımlı değil ve script zaten hedef=kaynak aynı DB olduğu için anlamsız/gereksiz.
// Ürün/kategori/stok/fiyat yönetimi artık Fodos'un merkezi admin panelinden yapılıyor.
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const sourceDbUrl = process.env.FODOS_SOURCE_DB_URL
const targetDbUrl = process.env.DATABASE_URL

if (!sourceDbUrl || !targetDbUrl) {
  console.error('Error: FODOS_SOURCE_DB_URL and DATABASE_URL must be defined in .env')
  process.exit(1)
}

const sourcePrisma = new PrismaClient({
  datasources: { db: { url: sourceDbUrl } },
})

const targetPrisma = new PrismaClient({
  datasources: { db: { url: targetDbUrl } },
})

async function main() {
  console.log('🚀 Fodos veritabanından Mobil Parça Merkezi veritabanına klonlama başlatılıyor...')

  try {
    // 1. Kategorileri Çek ve Klonla
    console.log('📂 Kategoriler aktarılıyor...')
    const categories = await sourcePrisma.category.findMany()
    console.log(`Bulunan kategori sayısı: ${categories.length}`)

    for (const cat of categories) {
      await targetPrisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          risk_profile: cat.risk_profile,
          template_type: cat.template_type || 'generic',
        },
        create: {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          risk_profile: cat.risk_profile,
          template_type: cat.template_type || 'generic',
        },
      })
    }
    console.log('✅ Kategoriler başarıyla aktarıldı.')

    // 2. Ürünleri ve Görselleri Çek
    console.log('📱 Ürünler aktarılıyor...')
    const products = await sourcePrisma.product.findMany({
      include: {
        images: true,
      },
    })
    console.log(`Bulunan ürün sayısı: ${products.length}`)

    let imported = 0
    for (const prod of products) {
      const { images, id, ...prodData } = prod

      const createdProduct = await targetPrisma.product.upsert({
        where: { barcode: prod.barcode },
        update: {
          ...prodData,
        },
        create: {
          ...prodData,
        },
      })

      // Görselleri Aktar
      if (images && images.length > 0) {
        await targetPrisma.productImage.deleteMany({
          where: { productId: createdProduct.id },
        })

        await targetPrisma.productImage.createMany({
          data: images.map((img) => ({
            productId: createdProduct.id,
            url: img.url,
            originalUrl: img.originalUrl,
            order: img.order,
          })),
        })
      }

      imported++
      if (imported % 100 === 0) {
        console.log(`İlerleme: ${imported} / ${products.length} ürün aktarıldı...`)
      }
    }

    console.log(`🎉 Tebrikler! Toplam ${imported} adet ürün ve tüm kategoriler Mobil Parça Merkezi veritabanına başarıyla kopyalandı!`)
  } catch (error) {
    console.error('Klonlama hatası:', error)
  } finally {
    await sourcePrisma.$disconnect()
    await targetPrisma.$disconnect()
  }
}

main()

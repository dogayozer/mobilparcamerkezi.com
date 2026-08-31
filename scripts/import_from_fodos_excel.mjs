// ⚠️ ARTIK KULLANILMIYOR — mobilparcamerkezi artık Fodos ile AYNI ortak veritabanını
// kullanıyor. Bu script çalıştırılırsa, Excel'den hesapladığı kendi sale_price/reference_price
// değerlerini PAYLAŞILAN Product tablosuna yazar ve Fodos'un canlı fiyatlarını EZER — ÇALIŞTIRMAYIN.
// Ürün/stok/fiyat yönetimi artık Fodos'un merkezi admin panelinden yapılıyor.
import { PrismaClient } from '@prisma/client'
import * as xlsx from 'xlsx'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

function mapCategoryToTemplateType(categoryName) {
  const cat = (categoryName || '').toLowerCase()
  if (cat.includes('kasa') || cat.includes('kılıf') || cat.includes('kapak')) return 'case'
  if (cat.includes('tuş takımı')) return 'keypad'
  if (cat.includes('şarj aleti') || cat.includes('adaptör')) return 'charger'
  if (cat.includes('şarj kablosu') || cat.includes('data kablosu')) return 'cable'
  if (cat.includes('batarya')) return 'battery'
  if (cat.includes('koruyucu')) return 'protector'
  return 'generic'
}

function parseStatus(status) {
  const s = String(status || '').toLowerCase().trim()
  if (s === 'pasif' || s === '0' || s === 'false' || s === 'inactive') return 'inactive'
  return 'active'
}

async function main() {
  console.log('🚀 Excel Dosyasından Mobil Parça Merkezi veritabanına aktarım başlatılıyor...')

  // Find Excel file
  const candidatePaths = [
    'C:/fodos/fodos.com.tr-oziurunler_updated10-08-26.xlsx',
    'C:/fodos/hedef_seo_tamami.xlsx',
    'C:/fodos/hedef.xlsx',
  ]

  let excelPath = candidatePaths.find((p) => fs.existsSync(p))
  if (!excelPath) {
    console.error('Excel dosyası bulunamadı:', candidatePaths)
    process.exit(1)
  }

  console.log(`Okunan dosya: ${excelPath}`)
  const workbook = xlsx.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

  console.log(`Toplam satır: ${rows.length}`)

  let created = 0
  let updated = 0

  const categoryCache = new Map()

  for (const row of rows) {
    const barcode = String(row['Barkod'] || '').trim()
    if (!barcode) continue

    const categoryName = String(row['Kategori İsmi'] || 'Diğer').trim()
    const templateType = mapCategoryToTemplateType(categoryName)
    const title = String(row['Ürün Adı'] || '').trim()

    let category = categoryCache.get(categoryName)
    if (!category) {
      const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'genel'
      category = await prisma.category.upsert({
        where: { slug },
        update: { name: categoryName, template_type: templateType },
        create: { name: categoryName, slug, template_type: templateType },
      })
      categoryCache.set(categoryName, category)
    }

    const trendyolPriceStr = String(
      row["Trendyol'da Satılacak Fiyat"] ||
        row['Satış Fiyatı'] ||
        row["Trendyol'da Satılacak Fiyat (KDV Dahil)"] ||
        row['Satış Fiyatı (KDV Dahil)'] ||
        row['Fiyat'] ||
        '0'
    )
    const trendyolPrice = parseFloat(trendyolPriceStr.replace(',', '.')) || 0

    let salePrice = trendyolPrice
    let refPrice = trendyolPrice

    if (trendyolPrice > 0) {
      let netPrice = trendyolPrice
      if (trendyolPrice <= 199.99) {
        netPrice = trendyolPrice - 41
      } else if (trendyolPrice <= 349.99) {
        netPrice = trendyolPrice - 79
      } else {
        netPrice = trendyolPrice - 93
      }
      salePrice = netPrice * 0.8
      refPrice = trendyolPrice
      if (salePrice < 0) salePrice = 0
    }

    const stockQtyStr = String(row['Ürün Stok Adedi'] || row['Stok'] || row['Stok Adedi'] || '0')
    const stockQty = parseInt(stockQtyStr) || 0

    let status = parseStatus(row['Durum'] || 'Aktif')
    if (stockQty <= 0) status = 'out_of_stock'

    const slug =
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + barcode

    let firstWordBrand = title.trim().split(' ')[0]
    if (!firstWordBrand) firstWordBrand = String(row['Marka'] || '')

    const productData = {
      model_code: String(row['Model Kodu'] || ''),
      brand: firstWordBrand,
      categoryId: category.id,
      title: title,
      slug: slug,
      description_raw: String(row['Ürün Açıklaması'] || ''),
      reference_price: refPrice,
      sale_price: salePrice,
      stock_qty: stockQty,
      status: status,
      trendyol_url: String(row['Trendyol.com Linki'] || ''),
      last_synced_at: new Date(),
    }

    const existingProduct = await prisma.product.findUnique({ where: { barcode } })
    let currentProdId = ''

    if (existingProduct) {
      const updatedProd = await prisma.product.update({
        where: { barcode },
        data: productData,
      })
      currentProdId = updatedProd.id
      updated++
    } else {
      const createdProd = await prisma.product.create({
        data: {
          barcode,
          ...productData,
        },
      })
      currentProdId = createdProd.id
      created++
    }

    // Process up to 8 images
    const imagesToCreate = []
    for (let idx = 1; idx <= 8; idx++) {
      const imgUrl = String(row[`Görsel ${idx}`] || row[`Gorsel ${idx}`] || '').trim()
      if (imgUrl && imgUrl.startsWith('http')) {
        imagesToCreate.push({
          productId: currentProdId,
          url: imgUrl,
          originalUrl: imgUrl,
          order: idx - 1,
        })
      }
    }

    if (imagesToCreate.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: currentProdId } })
      await prisma.productImage.createMany({ data: imagesToCreate })
    }

    if ((created + updated) % 100 === 0) {
      console.log(`İlerleme: ${created + updated} ürün işlendi...`)
    }
  }

  console.log(`✅ Tamamlandı! Oluşturulan: ${created}, Güncellenen: ${updated}`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())

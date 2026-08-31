export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) return '0,00 ₺'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(price)
}

// MPM ve Fodos artık aynı ortak veritabanını (Product tablosu) paylaşıyor.
// Fodos'un kendi sale_price/reference_price alanlarına dokunmadan, MPM'e özel fiyatı
// (mpm_sale_price/mpm_reference_price, Fodos admin panelindeki "Toplu Fiyat Güncelleme"
// ekranından marka seçilerek hesaplanır) buradan tek noktadan uyguluyoruz.
// MPM fiyatı henüz hesaplanmamışsa (mpm_sale_price null), ürün "0 TL" görünmesin diye
// sırasıyla original_excel_price, sonra Fodos'un sale_price'ına düşer.
type MpmPriceableProduct = {
  sale_price: number
  reference_price?: number | null
  mpm_sale_price?: number | null
  mpm_reference_price?: number | null
  original_excel_price?: number | null
}

export function withMpmPrice<T extends MpmPriceableProduct>(
  product: T
): T & { sale_price: number; reference_price: number | null } {
  const sale_price =
    product.mpm_sale_price ?? product.original_excel_price ?? product.sale_price
  const reference_price = product.mpm_reference_price ?? product.reference_price ?? null
  return { ...product, sale_price, reference_price }
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

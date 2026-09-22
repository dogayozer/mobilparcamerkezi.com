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

// Ürün açıklamaları (description_raw) Fodos ile ortak veritabanından geliyor ve
// büyük çoğunluğu ("%95+") "Fodos güvencesiyle/kalitesiyle" gibi Fodos marka adını
// içeriyor. Bu, sadece GÖSTERİM anında MPM'e çeviriyor — paylaşılan veriye
// dokunulmuyor, Fodos'un kendi sitesindeki metin aynen kalıyor.
export function mpmizeText<T extends string | null | undefined>(text: T): T {
  if (!text) return text
  return text.replace(/\bFodos\b/g, 'Mobil Parça Merkezi') as T
}

// Fodos ile aynı veritabanını paylaştığımız için description_raw metni (yasal uyarı +
// teknik bilgi bloğu) her iki sitede de neredeyse birebir aynı görünüyor. Google Search
// Console'da bu, mobilparcamerkezi.com'un binlerce ürün sayfasının "keşfedildi ama
// dizine eklenmedi" durumunda kalmasına (muhtemelen duplicate content olarak
// değerlendirilmesine) yol açtı. Bu fonksiyon kategoriye özel, marka değişkenli bir
// açılış cümlesi üretir — SADECE mobilparcamerkezi'nin render'ında eklenir, paylaşılan
// description_raw'a hiç yazılmaz, bu yüzden fodos.com.tr'yi etkilemez.
const CATEGORY_INTROS: Record<string, (brand: string) => string> = {
  'anten-nfc': (b) =>
    `${b}anten ve NFC modülü, sinyal gücünü ve temassız ödeme/bağlantı performansını doğrudan etkiler; zayıf çekim veya NFC okuma sorunlarında bu parçanın değişimi çözüm sağlar.`,
  'arka-kapak-batarya-kapak': (b) =>
    `${b}arka kapağı hem bataryayı koruyan hem de cihazın dış görünümünü tamamlayan parçadır; çatlamış veya kırılmış kapaklar suya/toza karşı koruma kaybına da yol açabilir.`,
  batarya: (b) =>
    `${b}orijinal ölçülerine uygun bu batarya/konnektör parçası, pil ömrünün kısalması veya şarj/açılma sorunlarında güvenli bir değişim seçeneğidir.`,
  'bord-motor': (b) =>
    `${b}anakart üzerindeki bu devre elemanı, şarj, güç yönetimi veya sinyal iletiminde kritik rol oynar; montajı teknik bilgi gerektirir, gerekirse yetkili bir teknisyenden destek alın.`,
  'ekranlar-ve-koruyucular': (b) =>
    `${b}ekranına birebir uyumlu bu parça, çizik/kırık ekran sorunlarında veya ekstra koruma ihtiyacında hızlı bir çözüm sunar.`,
  'flex-kablolar': (b) =>
    `${b}tuş, ses, dokunmatik veya bağlantı sinyallerini taşıyan bu flex kablo, ilgili fonksiyon çalışmadığında değiştirilmesi gereken hassas bir iç bileşendir.`,
  'kamera-ve-lensler-lens-kapaklari': (b) =>
    `${b}kamera modülüne veya lens camına özel bu parça, bulanık görüntü, çizilmiş lens veya kamera arızalarında orijinal netliği geri kazandırır.`,
  'kulaklik-mikrofon-hoporlor': (b) =>
    `${b}ses donanımına (kulaklık, mikrofon veya hoparlör) ait bu parça, ses gelmemesi, kısık ses veya karşı tarafın sizi duyamaması gibi sorunlarda değişimi gereken bileşendir.`,
  sensorler: (b) =>
    `${b}bu sensör modülü (yakınlık, ışık, parmak izi vb.) beklendiği gibi tepki vermiyorsa, orijinal ölçülerde uyumlu değişimi sorunu kalıcı olarak çözer.`,
  'sim-kart-sim-tepsi': (b) =>
    `${b}özel bu sim kart tepsisi/aparatı, kaybolan, kırılan veya tırnakları aşınmış orijinal tepsinin yerine birebir oturacak şekilde üretilmiştir.`,
  'tamir-malzemeleri-aksesuar': () =>
    `Telefon tamirinde yaygın kullanılan bu malzeme, marka/modelden bağımsız olarak çoğu cihazda güvenle kullanılabilecek bir tamir aksesuarıdır.`,
  'telefon-kasasi': (b) =>
    `${b}dış kasasına birebir uyumlu bu parça, çizilmiş veya kırılmış kasanın komple yenilenmesini sağlar.`,
  'tus-takimlari': (b) =>
    `${b}tuş takımı, güç ve ses tuşlarının fiziksel tepkisini sağlayan parçadır; tuşlara basıldığında tepki alınamıyorsa veya tuş sıkışıyorsa değişimi gerekir.`,
  'sarj-aleti-sarj-kablosu': (b) =>
    `${b}desteklediği hızlı şarj standardına uygun bu şarj aleti/kablosu, güvenli ve verimli şarj performansı sağlar.`,
}

export function getCategoryIntro(categorySlug: string | null | undefined, brand: string | null | undefined): string {
  const template = categorySlug ? CATEGORY_INTROS[categorySlug] : undefined
  if (!template) return ''
  const brandPrefix = brand ? `${brand} cihazınızın ` : 'Cihazınızın '
  return template(brandPrefix)
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

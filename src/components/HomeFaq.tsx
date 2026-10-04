import Link from 'next/link'
import { getStoreSettings } from '@/lib/data'

// Ana sayfa SSS: "cep telefonu parça / parçası / yedek parça" ifadeleri görünür metinde geçer; kargo bilgileri
// mağaza ayarlarından gelir. Aynı içerik FAQPage JSON-LD olarak da yazılır.
export async function HomeFaq() {
  const s: any = await getStoreSettings()
  const threshold = Number(s?.shippingThreshold ?? 500).toLocaleString('tr-TR')
  const fee = Number(s?.shippingFee ?? 130).toLocaleString('tr-TR')
  const cutoff = s?.sameDayShippingTime || '16:30'

  const faqs: { q: string; a: string }[] = [
    {
      q: 'Mobil Parça Merkezi’nde hangi cep telefonu parçaları satılıyor?',
      a: 'Apple, Samsung, Xiaomi, Huawei, Oppo, Tecno ve Infinix gibi markaların modellerine uygun ekran, batarya, şarj soketi, arka kapak, kasa, kamera ve hoparlör başta olmak üzere geniş bir cep telefonu yedek parça yelpazesi bulunur.',
    },
    {
      q: 'Aradığım cep telefonu parçasını nasıl bulurum?',
      a: 'Sitedeki arama kutusuna telefonunuzun marka ve modelini (örneğin “Galaxy A52 ekran”) yazmanız yeterli. Model kodunuzdan da arama yapabilirsiniz. Parçanın uyumundan emin değilseniz WhatsApp teknik hattımızdan sorun.',
    },
    {
      q: 'Cep telefonu yedek parçası toptan alınabilir mi?',
      a: 'Evet. Telefon tamircileri ve satıcılar için bayi hesabı açabilirsiniz. Onaydan sonra bayilere özel fiyat listesiyle toplu alım yapabilirsiniz. Başvuru için Bayi Girişi sayfasını kullanın.',
    },
    {
      q: 'Siparişim aynı gün kargolanıyor mu?',
      a: `Hafta içi saat ${cutoff}’a kadar verilen ve ödemesi onaylanan siparişler, stok durumuna göre aynı gün kargoya teslim edilir. Gönderiniz yola çıkınca kargo firması ve takip numarası e-posta ile bildirilir.`,
    },
    {
      q: 'Kargo ücretini kim öder, ücretsiz kargo var mı?',
      a: `${threshold} TL ve üzerindeki alışverişlerde kargo bizden. Bu tutarın altındaki siparişlerde kargo bedeli ${fee} TL olarak sepete yansır.`,
    },
    {
      q: 'Kart bilgilerim güvende mi?',
      a: 'Ödeme, PayTR güvenli ödeme sayfası üzerinden 3D Secure ile alınır. Kart bilgileriniz Mobil Parça Merkezi sunucularında tutulmaz.',
    },
    {
      q: 'Siparişim için fatura alabilir miyim?',
      a: 'Evet. Siparişiniz için e-arşiv fatura düzenlenir. Şirket adına fatura isterseniz sipariş sırasında vergi bilgilerinizi girebilirsiniz.',
    },
    {
      q: 'Yanlış ya da uyumsuz parça gelirse ne yapmalıyım?',
      a: 'İade, değişim ve garanti şartlarımızı İade ve Garanti sayfasında bulabilirsiniz. Bir sorun olursa WhatsApp hattımızdan bize yazın, birlikte çözelim.',
    },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <section className="bg-paper py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-ink mb-6">Sıkça Sorulan Sorular</h2>
        <div className="divide-y divide-ink/10 border border-ink/10 rounded-md overflow-hidden bg-white">
          {faqs.map((f) => (
            <details key={f.q} className="group p-4 sm:p-5">
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4 font-semibold text-ink">
                {f.q}
                <span className="text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-soft">
          Kargo ve iade ayrıntıları için <Link href="/kargo-takibi" className="font-semibold underline">Kargo Takibi</Link> ve{' '}
          <Link href="/iade-ve-garanti" className="font-semibold underline">İade ve Garanti</Link> sayfalarına bakabilirsiniz.
        </p>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  )
}

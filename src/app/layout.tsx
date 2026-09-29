import type { Metadata } from 'next'
import { Inter, Big_Shoulders, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import SmartAssistant from '@/components/SmartAssistant'
import MobileBottomNav from '@/components/MobileBottomNav'
import DealerSplash from '@/components/DealerSplash'
import CampaignSplash from '@/components/CampaignSplash'
import Link from 'next/link'
import { CAMPAIGN } from '@/lib/campaignConfig'
import { getCampaignShowcase } from '@/lib/campaign'
import { getCategoryTree, getStoreSettings, getTopBrands } from '@/lib/data'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bigShoulders = Big_Shoulders({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-big-shoulders',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-mono',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Mobil Parça Merkezi - Telefon Yedek Parça, Batarya, Kasa ve Aksesuarlar',
  description:
    'En kaliteli telefon bataryaları, ekranlar, kasalar, şarj aletleri ve yedek parçalar en uygun fiyat ve aynı gün kargo avantajıyla Mobil Parça Merkezi’nde.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Mobil Parça Merkezi - Telefon Yedek Parça, Batarya, Kasa ve Aksesuarlar',
    description:
      'En kaliteli telefon bataryaları, ekranlar, kasalar, şarj aletleri ve yedek parçalar en uygun fiyat ve aynı gün kargo avantajıyla Mobil Parça Merkezi’nde.',
    url: SITE_URL,
    siteName: 'Mobil Parça Merkezi',
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, settings, topBrands] = await Promise.all([
    getCategoryTree(),
    getStoreSettings(),
    getTopBrands(7),
  ])
  const showcase = CAMPAIGN.active ? await getCampaignShowcase() : null
  const campaignLive = !!showcase && showcase.items.length > 0

  return (
    <html lang="tr" className={`${inter.variable} ${bigShoulders.variable} ${plexMono.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-paper text-ink selection:bg-yellow-500 selection:text-ink pb-16 md:pb-0`}>
        <CartProvider shippingThreshold={settings.shippingThreshold ?? 500} shippingFee={settings.shippingFee ?? 90}>
          {campaignLive && (
            <Link
              href={CAMPAIGN.path}
              className="block bg-yellow-500 hover:bg-yellow-400 text-ink text-center text-[11px] sm:text-xs font-display font-extrabold uppercase tracking-wide py-2 px-3 transition-colors"
            >
              {CAMPAIGN.name} başladı{showcase!.maxDiscount > 0 ? ` — %${showcase!.maxDiscount}'e varan indirim` : ''} · Kampanyalı adaptörlere git →
            </Link>
          )}
          <Header categories={categories} settings={settings} topBrands={topBrands} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
          <SmartAssistant />
          <MobileBottomNav />
          {campaignLive && <CampaignSplash items={showcase!.items} maxDiscount={showcase!.maxDiscount} total={showcase!.total} />}
          <DealerSplash waitForCampaign={campaignLive} />
        </CartProvider>
      </body>
    </html>
  )
}

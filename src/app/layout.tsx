import type { Metadata } from 'next'
import { Inter, Big_Shoulders, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import SmartAssistant from '@/components/SmartAssistant'
import MobileBottomNav from '@/components/MobileBottomNav'
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

  return (
    <html lang="tr" className={`${inter.variable} ${bigShoulders.variable} ${plexMono.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-paper text-ink selection:bg-yellow-500 selection:text-ink pb-16 md:pb-0`}>
        <CartProvider>
          <Header categories={categories} settings={settings} topBrands={topBrands} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
          <SmartAssistant />
          <MobileBottomNav />
        </CartProvider>
      </body>
    </html>
  )
}

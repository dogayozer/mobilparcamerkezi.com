import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import SmartAssistant from '@/components/SmartAssistant'
import MobileBottomNav from '@/components/MobileBottomNav'
import { getCategoryTree, getStoreSettings } from '@/lib/data'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mobil Parça Merkezi - Telefon Yedek Parça, Batarya, Kasa ve Aksesuarlar',
  description:
    'En kaliteli telefon bataryaları, ekranlar, kasalar, şarj aletleri ve yedek parçalar en uygun fiyat ve aynı gün kargo avantajıyla Mobil Parça Merkezi’nde.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, settings] = await Promise.all([
    getCategoryTree(),
    getStoreSettings(),
  ])

  return (
    <html lang="tr">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-red-500 selection:text-white pb-16 md:pb-0`}>
        <CartProvider>
          <Header categories={categories} settings={settings} />
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

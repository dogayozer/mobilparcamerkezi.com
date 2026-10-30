import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

  return {
    rules: [
      // Model eğitimi için tarayan botlar kapalı (arama botları — OAI-SearchBot, Claude-SearchBot — açık kalır)
      { userAgent: ['GPTBot', 'ClaudeBot'], disallow: '/' },
      {
        userAgent: '*',
        allow: '/',
        // /kategori/*? : marka/model/sıralama filtreli adresler (her biri önbelleksiz sunucu işi ve DB sorgusu)
        disallow: ['/admin/', '/api/', '/hesabim/', '/sepet', '/odeme', '/giris', '/kayit-ol', '/kategori/*?'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mobilparcamerkezi.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/hesabim/', '/sepet', '/odeme', '/giris', '/kayit-ol'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

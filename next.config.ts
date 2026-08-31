import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Ürün görselleri zaten Trendyol CDN'inden optimize halde geliyor; Vercel'in
    // Image Optimization kotası (Hobby planda aylık limitli, fodos-ecommerce ile
    // paylaşılıyor ve doluydu) görselleri engellememesi için optimizasyon kapatıldı.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;

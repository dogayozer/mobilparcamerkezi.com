import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSessionToken } from '@/lib/adminSession'

// Tüm /api/admin/* uçlarını imzalı admin oturumuyla korur (giriş/çıkış ucu hariç).
// Route handler'lardaki kendi kontrolleri de duruyor; bu, kontrolü unutulmuş bir uç
// kalırsa (örn. eskiden herkese açık olan kupon listesi) diye ikinci savunma hattı.
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')
  if (!(await verifyAdminSessionToken(session?.value))) {
    return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}
